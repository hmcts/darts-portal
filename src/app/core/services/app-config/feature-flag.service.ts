import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { basicLogger, createClient, LDClient } from '@launchdarkly/js-client-sdk';
import { LaunchDarklyUserContext } from '@core-types/user/launch-darkly-user-context.interface';
import { AppConfig, AppConfigService } from '@services/app-config/app-config.service';
import { from, lastValueFrom, Observable, of, tap } from 'rxjs';
import { FEATURE_FLAG_DEFAULTS } from './feature-flag-defaults.constant';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService implements OnDestroy {
  private appConfigService = inject(AppConfigService);
  private http = new HttpClient(inject(HttpBackend)); // Bypasses interceptors so signing failures don't redirect users as default values can be used.
  private launchDarklyClient?: LDClient; // SDK instance that loads flags and receives background updates.
  private userId?: number; // User whose flags the current connection is loading.
  private resetMarker = Symbol(); // Replaced by reset() so old background results can be ignored in case user changes.
  private initialConnectionWait: Promise<void> = Promise.resolve(); // Shared page wait for the initial connection, limited by a timeout.
  private featureFlagSnapshot: Record<string, unknown> = {}; // Snapshot used by the page, refreshed when loadUserFlags is called which is expected to be on navigation to any authenticated page.

  // Leave the existing environment-based flags as they are. These methods can be removed
  // if the flags are migrated to LaunchDarkly or are no longer needed.
  isManualDeletionEnabled(): boolean {
    const enabled = this.config?.features?.manualDeletion?.enabled;
    if (enabled === undefined || enabled === null) {
      return false;
    }
    return enabled === 'true';
  }

  isEventObfuscationEnabled(): boolean {
    const enabled = this.config?.features?.eventObfuscation?.enabled;
    if (enabled === undefined || enabled === null) {
      return false;
    }
    return enabled === 'true';
  }

  /**
   * Fetches the user's feature flag values from launch darkly if there is a client Id and
   * local overrides are disabled. It will try to connect once for each user until a reset
   * or refresh allows another attempt.
   * It is assumed this will be called each time the user navigates to
   * a new authenticate page to keep the view of the page consistent while a user is on it.
   */
  loadUserFlags(userId: number): Observable<void> {
    if (this.config?.launchDarklyLocalOverride === true || !this.config?.launchDarklyClientId?.trim()) {
      return of(undefined);
    }

    // If someone logs in with as a different user, a new connection will be established
    // to ensure they get the feature flags for that user and not the previous one.
    if (this.userId !== userId) {
      this.reset();
      this.userId = userId;
      const resetMarker = this.resetMarker;
      const connectionAttempt = this.getLaunchDarklyUserContext().then((signedContext) => {
        if (!signedContext || this.hasResetHappened(resetMarker)) {
          // Stop if signing failed, as a connection will not be possible, or a reset made this
          // attempt outdated, as the result is no longer needed.
          return;
        }
        return this.startLaunchDarklyClient(signedContext.context, signedContext.hash);
      });

      // Create a limited wait for the first connection attempt so the user is not blocked from
      // seeing the page if the connection is slow or fails. The attempt will continue in the
      // background if the wait expires.
      this.initialConnectionWait = this.waitForInitialConnection(
        connectionAttempt,
        this.config.launchDarklyInitialConnectionTimeoutMs
      );
    }

    const resetMarker = this.resetMarker;
    // Wait for the initial connection to complete or timeout before setting the page flags.
    // If the initial wait has already finished, continue without waiting again.
    return from(this.initialConnectionWait).pipe(
      tap(() => {
        if (!this.hasResetHappened(resetMarker)) {
          // Only update the service's flag values at this point so the user gets a consistent
          // view of an open page.
          this.featureFlagSnapshot = this.launchDarklyClient ? { ...this.launchDarklyClient.allFlags() } : {};
        }
      })
    );
  }

  /**
   * Returns whether the feature flag is enabled. If local overrides are enabled,
   * the value is taken from the local flags. Otherwise, it uses the saved
   * LaunchDarkly value for the page.
   * If the flag is missing or its value is not a boolean, the default is used.
   */
  isEnabled(flagKey: keyof typeof FEATURE_FLAG_DEFAULTS): boolean {
    let featureFlagValue = this.featureFlagSnapshot[flagKey];
    if (this.config?.launchDarklyLocalOverride === true) {
      featureFlagValue = this.config.launchDarklyLocalFlags?.[flagKey];
    }
    return typeof featureFlagValue === 'boolean' ? featureFlagValue : FEATURE_FLAG_DEFAULTS[flagKey];
  }

  /**
   * Closes the LaunchDarkly client and clears the current user, saved flag values,
   * and initial wait. Changes the reset marker so any background work
   * started before the reset is ignored if it completes afterwards.
   */
  reset(): void {
    void this.launchDarklyClient?.close().catch(() => undefined);
    this.launchDarklyClient = undefined;
    this.userId = undefined;
    this.resetMarker = Symbol();
    this.initialConnectionWait = Promise.resolve();
    this.featureFlagSnapshot = {};
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private get config(): AppConfig | undefined {
    return this.appConfigService.getAppConfig();
  }

  private hasResetHappened(resetMarker: symbol): boolean {
    return this.resetMarker !== resetMarker;
  }

  /**
   * Waits for the connection attempt to finish or the timeout to expire.
   * Reaching the timeout lets the page continue without cancelling the background attempt.
   */
  private waitForInitialConnection(connection: Promise<void>, timeoutMs: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, timeoutMs);
      void connection.then(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  /**
   * Gets the signed user context from the Portal server and checks that it contains
   * the expected user ID and a non-empty hash. Returns undefined on failure so the page
   * can use defaults. Another attempt requires a browser refresh or a reset, such as after
   * logout or a user change.
   */
  private async getLaunchDarklyUserContext(): Promise<LaunchDarklyUserContext | undefined> {
    const expectedUserId = this.userId;
    try {
      const { context, hash } = await lastValueFrom(
        this.http.get<LaunchDarklyUserContext>('/user/launchdarkly-context')
      );

      if (context.kind !== 'user' || context.key !== String(expectedUserId) || typeof hash !== 'string' || !hash) {
        throw new Error('Invalid LaunchDarkly context');
      }

      return { context, hash };
    } catch {
      console.warn('Failed to get signed LaunchDarkly user context; using defaults.');
      return undefined;
    }
  }

  /**
   * Creates and starts the SDK client using the signed user context required for secure mode.
   * The SDK continues loading and receiving updates in the background after the wait expires.
   * SDK failures are handled here so cached values or defaults can still be used.
   */
  private async startLaunchDarklyClient(context: LaunchDarklyUserContext['context'], hash: string): Promise<void> {
    try {
      if (!this.config?.launchDarklyClientId?.trim()) {
        console.warn('LaunchDarkly client-side ID is missing or blank; using default flag values.');
        return;
      }

      // Streaming is set to true so it will recieve background updates to flag changes.
      this.launchDarklyClient = createClient(this.config.launchDarklyClientId.trim(), context, {
        streaming: true,
        // SDK logs can include user context; use our own short warnings instead.
        logger: basicLogger({ level: 'none' }),
      });

      // Keep loading flags in the background if the page's initial wait expires.
      const result = await this.launchDarklyClient.start({
        identifyOptions: { hash, noTimeout: true },
      });

      if (result.status === 'failed') {
        throw result.error;
      }
    } catch {
      console.warn('LaunchDarkly startup failed; using last known flags or defaults.');
    }
  }
}
