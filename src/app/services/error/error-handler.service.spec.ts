import { HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let errorHandlerService: ErrorHandlerService;
  let mockAppInsightsService: AppInsightsService;
  let mockRouter: Router;

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
    mockRouter = TestBed.inject(Router);
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

  it('should route to internal-error page on 500 response', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');

    errorHandlerService.handleError(error);

    expect(navigateSpy).toHaveBeenCalledWith('internal-error');
  });
});
