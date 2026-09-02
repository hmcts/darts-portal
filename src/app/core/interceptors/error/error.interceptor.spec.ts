import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ErrorMessageService } from '@services/error/error-message.service';
import { WINDOW } from '@utils/tokens';
import { throwError } from 'rxjs';
import { ErrorInterceptor } from './error.interceptor';

class MockWindow {
  location = {
    href: '',
  };
}

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let mockWindow: MockWindow;
  let errorHandler: { handleError: jest.Mock };
  let errorMessageService: { handleErrorMessage: jest.Mock };

  beforeEach(() => {
    mockWindow = new MockWindow();
    errorHandler = { handleError: jest.fn() };
    errorMessageService = { handleErrorMessage: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: ErrorHandler, useValue: errorHandler },
        { provide: ErrorMessageService, useValue: errorMessageService },
        { provide: WINDOW, useValue: mockWindow },
      ],
    });
    interceptor = TestBed.inject(ErrorInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should handle 401 error', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: () => throwError(() => errorResponse),
    };

    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(mockWindow.location.href).toEqual('/login');
        expect(errorMessageService.handleErrorMessage).not.toHaveBeenCalled();
        expect(errorHandler.handleError).toHaveBeenCalledWith(errorResponse);
        done();
      },
    });
  });

  it('should parse problem details returned as a blob before handling the error', (done) => {
    const problemDetails = {
      type: 'CASE_100',
      title: 'Too many results',
      status: 422,
      detail: 'Search criteria returned more than 500 results',
      instance: '/cases/search',
    };
    const errorResponse = new HttpErrorResponse({
      error: new Blob([JSON.stringify(problemDetails)], { type: 'application/problem+json' }),
      status: 422,
      statusText: 'Unprocessable Entity',
      url: '/api/cases/search',
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: () => throwError(() => errorResponse),
    };

    interceptor.intercept(request, next).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.error).toEqual(problemDetails);
        expect(errorMessageService.handleErrorMessage).toHaveBeenCalledWith(error);
        expect(errorHandler.handleError).toHaveBeenCalledWith(error);
        done();
      },
    });
  });

  it('should parse legacy json problem responses returned as a blob', (done) => {
    const problemDetails = {
      type: 'RETENTION_107',
      title: 'The retention date being applied is too late.',
      status: 422,
      max_duration: '100Y0M0D',
    };
    const errorResponse = new HttpErrorResponse({
      error: new Blob([JSON.stringify(problemDetails)], { type: 'application/json+problem' }),
      status: 422,
      url: '/api/retentions',
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: () => throwError(() => errorResponse),
    };

    interceptor.intercept(request, next).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.error).toEqual(problemDetails);
        expect(errorMessageService.handleErrorMessage).toHaveBeenCalledWith(error);
        expect(errorHandler.handleError).toHaveBeenCalledWith(error);
        done();
      },
    });
  });
});
