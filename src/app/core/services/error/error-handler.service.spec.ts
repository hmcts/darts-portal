import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorHandlerService } from './error-handler.service';
import { AppConfig, AppConfigService } from '@services/app-config/app-config.service';

class MockWindow {
  location = {
    reload: jest.fn(),
    href: '',
  };
}

describe('ErrorHandlerService', () => {
  let errorHandlerService: ErrorHandlerService;
  let mockAppInsightsService: AppInsightsService;
  let mockAppConfigService: AppConfigService;
  let mockWindow: MockWindow;

  beforeEach(() => {
    mockWindow = new MockWindow();
    // Create a TestBed configuration with the ErrorHandlerService
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: AppInsightsService,
          useValue: {
            logException: jest.fn(),
            logTrace: jest.fn(),
          },
        },
        {
          provide: AppConfigService,
          useValue: {
            loadAppConfig: jest.fn().mockResolvedValue(undefined),
            getAppConfig: jest.fn(),
          },
        },
        Injector,
        { provide: 'Window', useValue: mockWindow },
      ],
    });

    // Get instances of the services and injector
    errorHandlerService = TestBed.inject(ErrorHandlerService);
    mockAppInsightsService = TestBed.inject(AppInsightsService);
    mockAppConfigService = TestBed.inject(AppConfigService);
  });

  it('should log an exception', () => {
    const error = new Error('Test Error');

    errorHandlerService.handleError(error);

    expect(mockAppInsightsService.logException).toHaveBeenCalledWith(error);
  });

  describe('"Failed to fetch dynamically imported module" errors', () => {
    const error = new Error('Failed to fetch dynamically imported module');

    it('reloads page if the version has changed', async () => {
      const loadConfigPromise = Promise.resolve();
      jest.spyOn(mockAppConfigService, 'loadAppConfig').mockReturnValue(loadConfigPromise);
      jest
        .spyOn(mockAppConfigService, 'getAppConfig')
        .mockReturnValueOnce({ version: '0.0.1' } as unknown as AppConfig)
        .mockReturnValueOnce({ version: '0.0.2' } as unknown as AppConfig);

      errorHandlerService.handleError(error);

      await loadConfigPromise;
      expect(mockAppConfigService.getAppConfig).toHaveBeenCalledTimes(2);
      expect(mockAppConfigService.loadAppConfig).toHaveBeenCalled();
      expect(mockAppInsightsService.logTrace).toHaveBeenCalledWith('Import module failed, page reloaded.');
      expect(mockWindow.location.reload).toHaveBeenCalled();
    });

    it('shows the error page if the version has not changed', async () => {
      const loadConfigPromise = Promise.resolve();
      jest.spyOn(mockAppConfigService, 'loadAppConfig').mockReturnValue(loadConfigPromise);
      jest
        .spyOn(mockAppConfigService, 'getAppConfig')
        .mockReturnValueOnce({ version: '0.0.1' } as unknown as AppConfig)
        .mockReturnValueOnce({ version: '0.0.1' } as unknown as AppConfig);

      errorHandlerService.handleError(error);

      await loadConfigPromise;
      expect(mockAppConfigService.getAppConfig).toHaveBeenCalledTimes(2);
      expect(mockAppConfigService.loadAppConfig).toHaveBeenCalled();
      expect(mockAppInsightsService.logException).toHaveBeenCalledWith(
        new Error('Import module failed but latest and cached versions are the same - 0.0.1')
      );
      expect(mockWindow.location.href).toBe('/internal-error');
    });
  });
});
