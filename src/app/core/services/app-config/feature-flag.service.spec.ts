import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createClient } from '@launchdarkly/js-client-sdk';
import { AppConfigService } from '@services/app-config/app-config.service';
import { firstValueFrom } from 'rxjs';
import { FEATURE_FLAG_DEFAULTS } from './feature-flag-defaults.constant';
import { FeatureFlagService } from './feature-flag.service';

jest.mock('@launchdarkly/js-client-sdk', () => ({
  createClient: jest.fn(),
  basicLogger: jest.fn(),
}));

jest.mock('./feature-flag-defaults.constant', () => ({
  FEATURE_FLAG_DEFAULTS: { 'test-flag': false },
}));

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let appConfigServiceMock: { getAppConfig: jest.Mock };

  beforeEach(() => {
    appConfigServiceMock = { getAppConfig: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FeatureFlagService,
        { provide: AppConfigService, useValue: appConfigServiceMock },
      ],
    });

    service = TestBed.inject(FeatureFlagService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isManualDeletionEnabled', () => {
    it('should return true when manualDeletion is enabled', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { manualDeletion: { enabled: 'true' } },
      });
      expect(service.isManualDeletionEnabled()).toBe(true);
    });

    it('should return false when manualDeletion is disabled', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { manualDeletion: { enabled: false } },
      });
      expect(service.isManualDeletionEnabled()).toBe(false);
    });

    it('should return false when manualDeletion is undefined', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: {},
      });
      expect(service.isManualDeletionEnabled()).toBe(false);
    });

    it('should return false when features is undefined', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({});
      expect(service.isManualDeletionEnabled()).toBe(false);
    });

    it('should return false when getAppConfig returns null', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue(null);
      expect(service.isManualDeletionEnabled()).toBe(false);
    });

    it('should return false when enabled is null', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { manualDeletion: { enabled: null } },
      });
      expect(service.isManualDeletionEnabled()).toBe(false);
    });

    it('should return true for truthy non-boolean values', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { manualDeletion: { enabled: 'true' } },
      });
      expect(service.isManualDeletionEnabled()).toBe(true);
    });

    it('should return false for falsy non-boolean values', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { manualDeletion: { enabled: 0 } },
      });
      expect(service.isManualDeletionEnabled()).toBe(false);
    });
  });

  describe('isEventObfuscationEnabled', () => {
    it('should return true when eventObfuscation is enabled', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { eventObfuscation: { enabled: 'true' } },
      });
      expect(service.isEventObfuscationEnabled()).toBe(true);
    });

    it('should return false when eventObfuscation is disabled', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { eventObfuscation: { enabled: false } },
      });
      expect(service.isEventObfuscationEnabled()).toBe(false);
    });

    it('should return false when eventObfuscation is undefined', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: {},
      });
      expect(service.isEventObfuscationEnabled()).toBe(false);
    });

    it('should return false when features is undefined', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({});
      expect(service.isEventObfuscationEnabled()).toBe(false);
    });

    it('should return false when getAppConfig returns null', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue(null);
      expect(service.isEventObfuscationEnabled()).toBe(false);
    });

    it('should return false when enabled is null', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { eventObfuscation: { enabled: null } },
      });
      expect(service.isEventObfuscationEnabled()).toBe(false);
    });

    it('should return true for truthy non-boolean values', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { eventObfuscation: { enabled: 'true' } },
      });
      expect(service.isEventObfuscationEnabled()).toBe(true);
    });

    it('should return false for falsy non-boolean values', () => {
      appConfigServiceMock.getAppConfig.mockReturnValue({
        features: { eventObfuscation: { enabled: 0 } },
      });
      expect(service.isEventObfuscationEnabled()).toBe(false);
    });
  });

  describe('updateUserFlagSnapshot', () => {
    const userId = 1;
    const flagValues = { 'test-flag': true };
    const signedContext = { context: { kind: 'user', key: String(userId) }, hash: 'test-hash' };

    let httpMock: HttpTestingController;
    let launchDarklyClient: { start: jest.Mock; allFlags: jest.Mock; close: jest.Mock };

    let config: {
      launchDarklyClientId?: string;
      launchDarklyInitialConnectionTimeoutMs: number;
      launchDarklyLocalOverride: boolean;
    };

    beforeEach(() => {
      jest.useFakeTimers();
      config = {
        launchDarklyClientId: 'test-client-id',
        launchDarklyInitialConnectionTimeoutMs: 100,
        launchDarklyLocalOverride: false,
      };
      appConfigServiceMock.getAppConfig.mockReturnValue(config);
      httpMock = TestBed.inject(HttpTestingController);
      launchDarklyClient = {
        start: jest.fn().mockResolvedValue({ status: 'complete' }),
        allFlags: jest.fn().mockReturnValue(flagValues),
        close: jest.fn().mockResolvedValue(undefined),
      };
      jest
        .mocked(createClient)
        .mockReset()
        .mockReturnValue(launchDarklyClient as unknown as ReturnType<typeof createClient>);
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
      httpMock.verify();
    });

    it('should not create a LaunchDarkly client when local overrides are enabled', async () => {
      config.launchDarklyLocalOverride = true;

      await firstValueFrom(service.updateUserFlagSnapshot(userId));

      expect(createClient).not.toHaveBeenCalled();
    });

    it('should not create a LaunchDarkly client when app config is not available', async () => {
      appConfigServiceMock.getAppConfig.mockReturnValue(undefined);

      await firstValueFrom(service.updateUserFlagSnapshot(userId));

      expect(createClient).not.toHaveBeenCalled();
    });

    it.each([undefined, '', '   '])(
      'should not create a LaunchDarkly client when the client ID is missing or blank - %p',
      async (clientId) => {
        config.launchDarklyClientId = clientId;

        await firstValueFrom(service.updateUserFlagSnapshot(userId));

        expect(createClient).not.toHaveBeenCalled();
      }
    );

    it('should not create a LaunchDarkly client when the signed context request fails', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock
        .expectOne('/user/launchdarkly-context')
        .flush(null, { status: 500, statusText: 'Internal Server Error' });
      await userFlagsReadyToUse;

      expect(createClient).not.toHaveBeenCalled();
    });

    it.each([
      {
        reason: 'context kind is not user',
        response: { ...signedContext, context: { ...signedContext.context, kind: 'other' } },
      },
      {
        reason: 'context user ID is different to the current users ID (2 instead of 1)',
        response: { ...signedContext, context: { ...signedContext.context, key: '2' } },
      },
      { reason: 'context is missing', response: { ...signedContext, context: undefined } },
      { reason: 'hash is missing', response: { ...signedContext, hash: undefined } },
      { reason: 'hash is an empty string', response: { ...signedContext, hash: '' } },
      { reason: 'hash is a number (123)', response: { ...signedContext, hash: 123 } },
    ])('should not create a LaunchDarkly client when the signed context is invalid - $reason', async ({ response }) => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(response);
      await userFlagsReadyToUse;

      expect(createClient).not.toHaveBeenCalled();
    });

    it('should not create a LaunchDarkly client when the signed context arrives after a reset', async () => {
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      const contextRequest = httpMock.expectOne('/user/launchdarkly-context');

      service.reset();
      contextRequest.flush(signedContext);
      await userFlagsReadyToUse;

      expect(createClient).not.toHaveBeenCalled();
    });

    it('should create a LaunchDarkly client with the signed user context and streaming true when updating user flag snapshot for a user for the first time', async () => {
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      expect(createClient).toHaveBeenCalledWith(
        config.launchDarklyClientId,
        signedContext.context,
        expect.objectContaining({ streaming: true })
      );
    });

    it('should pass the signed hash to LaunchDarkly when starting the LaunchDarkly client', async () => {
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      expect(launchDarklyClient.start).toHaveBeenCalledWith(
        expect.objectContaining({ identifyOptions: expect.objectContaining({ hash: signedContext.hash }) })
      );
    });

    it('should not retry the signed context request when it has already failed for the same user', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock
        .expectOne('/user/launchdarkly-context')
        .flush(null, { status: 500, statusText: 'Internal Server Error' });
      await userFlagsReadyToUse;

      await firstValueFrom(service.updateUserFlagSnapshot(userId));

      httpMock.expectNone('/user/launchdarkly-context');
    });

    it('should ignore the previous signed context when the user changes before it arrives', async () => {
      const differentUserId = 2;
      const previousUserFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      const previousContextRequest = httpMock.expectOne('/user/launchdarkly-context');

      const differentUserFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(differentUserId));
      httpMock.expectOne('/user/launchdarkly-context').flush({
        context: { kind: 'user', key: String(differentUserId) },
        hash: 'different-test-hash',
      });
      await differentUserFlagsReadyToUse;
      previousContextRequest.flush(signedContext);
      await previousUserFlagsReadyToUse;

      expect(createClient).toHaveBeenCalledTimes(1);
    });

    it('should reuse the current LaunchDarkly client when updating the user flag snapshot for the same user', async () => {
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      await firstValueFrom(service.updateUserFlagSnapshot(userId));

      expect(createClient).toHaveBeenCalledTimes(1);
    });

    it('should create a new LaunchDarkly client when updating the user flag snapshot for a different user', async () => {
      const differentUserId = 2;
      const differentUserContext = {
        context: { kind: 'user', key: String(differentUserId) },
        hash: 'different-test-hash',
      };
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      const differentUserFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(differentUserId));
      httpMock.expectOne('/user/launchdarkly-context').flush(differentUserContext);
      await differentUserFlagsReadyToUse;

      expect(createClient).toHaveBeenCalledWith(
        config.launchDarklyClientId,
        differentUserContext.context,
        expect.any(Object)
      );
    });

    it("should update the snapshot with the user's flag values from the LaunchDarkly client when the initial connection succeeds", async () => {
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      expect(service['featureFlagSnapshot']).toEqual(flagValues);
    });

    it('should update the snapshot with the latest flag values from the LaunchDarkly client when the LaunchDarkly client is already connected', async () => {
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;
      launchDarklyClient.allFlags.mockReturnValue({ 'test-flag': false });

      await firstValueFrom(service.updateUserFlagSnapshot(userId));

      expect(service['featureFlagSnapshot']).toEqual({ 'test-flag': false });
    });

    it('should not update the snapshot when the LaunchDarkly client finishes connecting after the initial wait times out', async () => {
      const clientFlagValues = { 'test-flag': false };
      launchDarklyClient.allFlags.mockReturnValue(clientFlagValues);
      launchDarklyClient.start.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              clientFlagValues['test-flag'] = true;
              resolve({ status: 'complete' });
            }, 2);
          })
      );

      service.updateUserFlagSnapshot(userId).subscribe();
      await jest.advanceTimersByTimeAsync(config.launchDarklyInitialConnectionTimeoutMs - 1);
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await jest.advanceTimersByTimeAsync(2);

      expect(service['featureFlagSnapshot']).toEqual({ 'test-flag': false });
    });

    it('should use the available flag values from the LaunchDarkly client when the initial connection wait times out', async () => {
      launchDarklyClient.start.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ status: 'complete' }), 2))
      );

      service.updateUserFlagSnapshot(userId).subscribe();
      await jest.advanceTimersByTimeAsync(config.launchDarklyInitialConnectionTimeoutMs - 1);
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await jest.advanceTimersByTimeAsync(1);

      expect(service['featureFlagSnapshot']).toEqual(flagValues);
    });

    it('should clear the previous snapshot when updating the flags for a different user', async () => {
      const differentUserId = 2;
      service['userId'] = userId;
      service['featureFlagSnapshot'] = { 'test-flag': true };

      const differentUserFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(differentUserId));
      const snapshotWhileLoading = { ...service['featureFlagSnapshot'] };
      httpMock
        .expectOne('/user/launchdarkly-context')
        .flush({ context: { kind: 'user', key: String(differentUserId) }, hash: 'different-test-hash' });
      await differentUserFlagsReadyToUse;

      expect(snapshotWhileLoading).toEqual({});
    });

    it('should leave the snapshot empty when creating the LaunchDarkly client throws an error', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      jest.mocked(createClient).mockImplementationOnce(() => {
        throw new Error('Client creation failed');
      });

      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      expect(service['featureFlagSnapshot']).toEqual({});
    });

    it('should leave the snapshot empty when starting the LaunchDarkly client rejects and no flag values are available', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      launchDarklyClient.start.mockRejectedValue(new Error('Startup failed'));
      launchDarklyClient.allFlags.mockReturnValue({});

      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      expect(service['featureFlagSnapshot']).toEqual({});
    });

    it('should use available flag values when starting the LaunchDarkly client rejects and flag values are available', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      launchDarklyClient.start.mockRejectedValue(new Error('Startup failed'));

      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      expect(service['featureFlagSnapshot']).toEqual(flagValues);
    });

    it('should use available flag values when starting the LaunchDarkly client returns a failed result and flag values are available', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      launchDarklyClient.start.mockResolvedValue({ status: 'failed', error: new Error('Startup failed') });

      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await userFlagsReadyToUse;

      expect(service['featureFlagSnapshot']).toEqual(flagValues);
    });

    it('should not change the snapshot when an earlier flag load finishes after reset', async () => {
      const userFlagsReadyToUse = firstValueFrom(service.updateUserFlagSnapshot(userId));
      const contextRequest = httpMock.expectOne('/user/launchdarkly-context');

      service.reset();
      service['featureFlagSnapshot'] = flagValues;
      contextRequest.flush(signedContext);
      await userFlagsReadyToUse;

      expect(service['featureFlagSnapshot']).toEqual(flagValues);
    });

    it('should complete the initial wait for user flags when the LaunchDarkly client connects within the timeout', async () => {
      const complete = jest.fn();

      service.updateUserFlagSnapshot(userId).subscribe({ complete });
      await jest.advanceTimersByTimeAsync(config.launchDarklyInitialConnectionTimeoutMs - 1);

      expect(complete).not.toHaveBeenCalled();

      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await jest.advanceTimersByTimeAsync(0);

      expect(complete).toHaveBeenCalledTimes(1);
    });

    it('should complete the initial wait for user flags when the timeout is reached before the user context is returned', async () => {
      const complete = jest.fn();

      service.updateUserFlagSnapshot(userId).subscribe({ complete });
      await jest.advanceTimersByTimeAsync(config.launchDarklyInitialConnectionTimeoutMs - 1);

      expect(complete).not.toHaveBeenCalled();

      await jest.advanceTimersByTimeAsync(1);

      expect(complete).toHaveBeenCalledTimes(1);

      // Finish the background request after checking the timeout.
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await jest.runAllTimersAsync();
    });

    it('should complete the initial wait for user flags when the timeout is reached before the LaunchDarkly client connects', async () => {
      const complete = jest.fn();
      launchDarklyClient.start.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ status: 'complete' }), 2)) // 2 ensures this finishes 1ms after the timeout
      );

      service.updateUserFlagSnapshot(userId).subscribe({ complete });
      await jest.advanceTimersByTimeAsync(config.launchDarklyInitialConnectionTimeoutMs - 1);
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await jest.advanceTimersByTimeAsync(0);

      expect(complete).not.toHaveBeenCalled();

      await jest.advanceTimersByTimeAsync(1);

      expect(complete).toHaveBeenCalledTimes(1);
    });

    it('should share the initial wait when flags are requested for the same user before it finishes', async () => {
      const complete = jest.fn();
      launchDarklyClient.start.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ status: 'complete' }), 2))
      );
      service.updateUserFlagSnapshot(userId).subscribe();
      await jest.advanceTimersByTimeAsync(config.launchDarklyInitialConnectionTimeoutMs - 1);
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);

      service.updateUserFlagSnapshot(userId).subscribe({ complete });
      await jest.advanceTimersByTimeAsync(0);

      expect(complete).not.toHaveBeenCalled();

      await jest.advanceTimersByTimeAsync(1);

      expect(complete).toHaveBeenCalledTimes(1);
    });

    it('should not wait when the initial connection wait for the same user has already finished', async () => {
      const complete = jest.fn();
      launchDarklyClient.start.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ status: 'complete' }), 2))
      );
      service.updateUserFlagSnapshot(userId).subscribe();
      await jest.advanceTimersByTimeAsync(config.launchDarklyInitialConnectionTimeoutMs - 1);
      httpMock.expectOne('/user/launchdarkly-context').flush(signedContext);
      await jest.advanceTimersByTimeAsync(1);

      service.updateUserFlagSnapshot(userId).subscribe({ complete });
      await jest.advanceTimersByTimeAsync(0);

      expect(complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('isEnabled', () => {
    const testFlag = 'test-flag' as keyof typeof FEATURE_FLAG_DEFAULTS;
    let config: { launchDarklyLocalOverride: boolean; launchDarklyLocalFlags?: Record<string, unknown> };

    beforeEach(() => {
      jest.replaceProperty(FEATURE_FLAG_DEFAULTS, testFlag, false);
      config = {
        launchDarklyLocalOverride: false,
        launchDarklyLocalFlags: { 'test-flag': false },
      };
      appConfigServiceMock.getAppConfig.mockReturnValue(config);
      service['featureFlagSnapshot'] = { 'test-flag': false };
    });

    it('should return the value from the snapshot when local overrides are disabled', () => {
      service['featureFlagSnapshot'] = { 'test-flag': true };

      const isEnabled = service.isEnabled(testFlag);

      expect(isEnabled).toBe(true);
    });

    it('should return the value from the local flags when local overrides are enabled', () => {
      config.launchDarklyLocalOverride = true;
      config.launchDarklyLocalFlags = { 'test-flag': true };

      const isEnabled = service.isEnabled(testFlag);

      expect(isEnabled).toBe(true);
    });

    it('should return the default value when the flag is missing from the snapshot', () => {
      FEATURE_FLAG_DEFAULTS[testFlag] = true;
      service['featureFlagSnapshot'] = {};

      const isEnabled = service.isEnabled(testFlag);

      expect(isEnabled).toBe(true);
    });

    it.each([undefined, {}])(
      'should return the default value when local overrides are enabled but the flag is missing - local flags: %p',
      (localFlags) => {
        FEATURE_FLAG_DEFAULTS[testFlag] = true;
        config.launchDarklyLocalOverride = true;
        config.launchDarklyLocalFlags = localFlags;

        const isEnabled = service.isEnabled(testFlag);

        expect(isEnabled).toBe(true);
      }
    );

    it.each([null, 'false', 0])('should return the default value for a non-boolean snapshot value - %p', (value) => {
      FEATURE_FLAG_DEFAULTS[testFlag] = true;
      service['featureFlagSnapshot'] = { 'test-flag': value };

      const isEnabled = service.isEnabled(testFlag);

      expect(isEnabled).toBe(true);
    });

    it.each([null, 'false', 0])('should return the default value for a non-boolean local value - %p', (value) => {
      FEATURE_FLAG_DEFAULTS[testFlag] = true;
      config.launchDarklyLocalOverride = true;
      config.launchDarklyLocalFlags = { 'test-flag': value };

      const isEnabled = service.isEnabled(testFlag);

      expect(isEnabled).toBe(true);
    });
  });

  describe('reset', () => {
    it('should close the existing LaunchDarkly client', () => {
      const close = jest.fn().mockResolvedValue(undefined);
      Object.assign(service, { launchDarklyClient: { close } });

      service.reset();

      expect(close).toHaveBeenCalledTimes(1);
    });

    it('should clear launchDarklyClient', () => {
      Object.assign(service, { launchDarklyClient: { close: jest.fn().mockResolvedValue(undefined) } });

      service.reset();

      expect(service['launchDarklyClient']).toBeUndefined();
    });

    it('should clear userId', () => {
      service['userId'] = 1;

      service.reset();

      expect(service['userId']).toBeUndefined();
    });

    it('should replace resetMarker with a new symbol', () => {
      const previousResetMarker = service['resetMarker'];

      service.reset();

      expect(typeof service['resetMarker']).toBe('symbol');
      expect(service['resetMarker']).not.toBe(previousResetMarker);
    });

    it('should replace initialConnectionWait with a resolved promise', async () => {
      const pendingConnectionWait = new Promise<void>(() => undefined);
      service['initialConnectionWait'] = pendingConnectionWait;

      service.reset();

      expect(service['initialConnectionWait']).not.toBe(pendingConnectionWait);
      await expect(service['initialConnectionWait']).resolves.toBeUndefined();
    });

    it('should clear featureFlagSnapshot', () => {
      service['featureFlagSnapshot'] = { 'test-flag': true };

      service.reset();

      expect(service['featureFlagSnapshot']).toEqual({});
    });

    it('should not fail when there is no LaunchDarkly client to close', () => {
      expect(() => service.reset()).not.toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call reset when the service is destroyed', () => {
      const resetSpy = jest.spyOn(service, 'reset').mockImplementation(() => undefined);

      service.ngOnDestroy();

      expect(resetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
