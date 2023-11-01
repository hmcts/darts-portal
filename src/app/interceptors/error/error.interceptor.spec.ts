import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ErrorMessageService } from '@services/error/error-message.service';
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

  beforeEach(() => {
    mockWindow = new MockWindow();
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: ErrorHandler, useValue: { handleError: jest.fn() } },
        { provide: ErrorMessageService, useValue: { handleErrorMessage: jest.fn() } },
        { provide: 'Window', useValue: mockWindow },
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
        expect(false);
        done();
      },
    });
  });
});
