import { HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorInterceptor } from './error.interceptor';

class MockWindow {
  location = {
    href: '',
  };
}

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let errorHandler: ErrorHandler;
  let mockWindow: MockWindow;

  beforeEach(() => {
    mockWindow = new MockWindow();
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: ErrorHandler, useValue: { handleError: jest.fn() } },
        { provide: 'Window', useValue: mockWindow },
      ],
    });
    interceptor = TestBed.inject(ErrorInterceptor);
    errorHandler = TestBed.inject(ErrorHandler);
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
        console.log(mockWindow.location.href);
        expect(mockWindow.location.href).toEqual('/login');
        expect(false);
        done();
      },
    });
  });

  it('should not handle non-401 errors', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 500 });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: () => throwError(() => errorResponse),
    };
    const handleErrorSpy = jest.spyOn(errorHandler, 'handleError');

    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
        console.log(mockWindow.location.href);
        expect(mockWindow.location.href).toBe('');
        expect(handleErrorSpy).toHaveBeenCalledWith(error);
        done();
      },
    });
  });
});
