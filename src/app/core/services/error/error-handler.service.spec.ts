import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorHandlerService, IGNORE_HTTP_STATUS_CODES, IMPORT_FAILED_MESSAGE } from './error-handler.service';
import { AppConfig, AppConfigService } from '@services/app-config/app-config.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  describe('dynamic module import errors', () => {
    const error = new Error(IMPORT_FAILED_MESSAGE.source);

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

  describe('ignored http status codes', () => {
    IGNORE_HTTP_STATUS_CODES.forEach((ignoredErrorCode) => {
      it(`logs trace for error with HTTP error code ${ignoredErrorCode}`, () => {
        const error = new HttpErrorResponse({
          status: ignoredErrorCode,
          statusText: 'Test error',
          url: 'http://darts.local/test',
        });
        errorHandlerService.handleError(error);

        expect(mockAppInsightsService.logTrace).toHaveBeenCalledWith(
          `Http failure response for http://darts.local/test: ${ignoredErrorCode} Test error`
        );
      });
    });
  });

  describe('network errors', () => {
    it('logs trace for network errors with ProgressEvent', () => {
      const error = new HttpErrorResponse({
        error: new ProgressEvent('test'),
        status: 0,
        statusText: 'Network error',
        url: 'http://darts.local/test',
      });
      errorHandlerService.handleError(error);

      expect(mockAppInsightsService.logTrace).toHaveBeenCalledWith(
        'Http failure response for http://darts.local/test: 0 Network error'
      );
    });

    it('logs exception for network errors without ProgressEvent', () => {
      const error = new HttpErrorResponse({
        status: 0,
        statusText: 'Network error',
        url: 'http://darts.local/test',
      });
      errorHandlerService.handleError(error);

      expect(mockAppInsightsService.logException).toHaveBeenCalledWith(
        expect.objectContaining({
          error: null,
          message: 'Http failure response for http://darts.local/test: 0 Network error',
          name: 'HttpErrorResponse',
          ok: false,
          status: 0,
          statusText: 'Network error',
          url: 'http://darts.local/test',
        })
      );
    });
  });
});
