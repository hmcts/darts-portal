import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@services/app-config/app-config.service';
import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let appConfigServiceMock: { getAppConfig: jest.Mock };

  beforeEach(() => {
    appConfigServiceMock = {
      getAppConfig: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [FeatureFlagService, { provide: AppConfigService, useValue: appConfigServiceMock }],
    });

    service = TestBed.inject(FeatureFlagService);
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
});
