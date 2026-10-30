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

  describe('loadUserFlags', () => {
    const userId = 1;

    let config: {
      launchDarklyClientId?: string;
      launchDarklyInitialConnectionTimeoutMs: number;
      launchDarklyLocalOverride: boolean;
    };

    beforeEach(() => {
      config = {
        launchDarklyClientId: 'test-client-id',
        launchDarklyInitialConnectionTimeoutMs: 500,
        launchDarklyLocalOverride: false,
      };
      appConfigServiceMock.getAppConfig.mockReturnValue(config);
      jest.mocked(createClient).mockReset();
    });

    afterEach(() => {
      TestBed.inject(HttpTestingController).verify();
    });

    it('should not create a LaunchDarkly client when local overrides are enabled', async () => {
      config.launchDarklyLocalOverride = true;

      await firstValueFrom(service.loadUserFlags(userId));

      expect(createClient).not.toHaveBeenCalled();
    });

    it('should not create a LaunchDarkly client when no client ID is configured', async () => {
      config.launchDarklyClientId = undefined;

      await firstValueFrom(service.loadUserFlags(userId));

      expect(createClient).not.toHaveBeenCalled();
    });

    it('should update the snapshot with the user\'s LaunchDarkly flag values when the initial connection succeeds', async () => {
      const flagValues = { 'test-flag': true };
      const allFlags = jest.fn().mockReturnValue({});
      jest.mocked(createClient).mockReturnValueOnce({
        start: jest.fn(async () => {
          allFlags.mockReturnValue(flagValues);
          return { status: 'complete' };
        }),
        allFlags,
        close: jest.fn().mockResolvedValue(undefined),
      } as unknown as ReturnType<typeof createClient>);

      const userFlagsReadyToUse = firstValueFrom(service.loadUserFlags(userId));
      TestBed.inject(HttpTestingController)
        .expectOne('/user/launchdarkly-context')
        .flush({ context: { kind: 'user', key: String(userId) }, hash: 'test-hash' });
      await userFlagsReadyToUse;

      expect(service['featureFlagSnapshot']).toEqual(flagValues);
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

      expect(service.isEnabled(testFlag)).toBe(true);
    });

    it('should return the value from the local flags when local overrides are enabled', () => {
      config.launchDarklyLocalOverride = true;
      config.launchDarklyLocalFlags = { 'test-flag': true };

      expect(service.isEnabled(testFlag)).toBe(true);
    });

    it('should return the default value when the flag is missing from the snapshot', () => {
      FEATURE_FLAG_DEFAULTS[testFlag] = true;
      service['featureFlagSnapshot'] = {};

      expect(service.isEnabled(testFlag)).toBe(true);
    });

    it.each([undefined, {}])(
      'should return the default value when local overrides are enabled but the flag is missing - local flags: %p',
      (localFlags) => {
        FEATURE_FLAG_DEFAULTS[testFlag] = true;
        config.launchDarklyLocalOverride = true;
        config.launchDarklyLocalFlags = localFlags;

        expect(service.isEnabled(testFlag)).toBe(true);
      }
    );

    it.each([null, 'false', 0])('should return the default value for a non-boolean snapshot value - %p', (value) => {
      FEATURE_FLAG_DEFAULTS[testFlag] = true;
      service['featureFlagSnapshot'] = { 'test-flag': value };

      expect(service.isEnabled(testFlag)).toBe(true);
    });

    it.each([null, 'false', 0])('should return the default value for a non-boolean local value - %p', (value) => {
      FEATURE_FLAG_DEFAULTS[testFlag] = true;
      config.launchDarklyLocalOverride = true;
      config.launchDarklyLocalFlags = { 'test-flag': value };

      expect(service.isEnabled(testFlag)).toBe(true);
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
