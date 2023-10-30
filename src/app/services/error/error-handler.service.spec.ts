import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let errorHandlerService: ErrorHandlerService;
  let mockAppInsightsService: AppInsightsService;

  beforeEach(() => {
    // Create a TestBed configuration with the ErrorHandlerService
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: AppInsightsService,
          useValue: {
            logException: jest.fn(),
          },
        },
        Injector,
      ],
    });

    // Get instances of the services and injector
    errorHandlerService = TestBed.inject(ErrorHandlerService);
    mockAppInsightsService = TestBed.inject(AppInsightsService);
  });

  it('should be created', () => {
    expect(errorHandlerService).toBeTruthy();
  });

  it('should log an exception', () => {
    const error = new Error('Test Error');
    const logExceptionSpy = jest.spyOn(mockAppInsightsService, 'logException');

    errorHandlerService.handleError(error);

    expect(logExceptionSpy).toHaveBeenCalledWith(error);
  });
});
