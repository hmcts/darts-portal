import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { ErrorInterceptor } from './error.interceptor';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

describe('ErrorInterceptor', () => {
  let httpHandlerSpy: HttpHandler;
  let errorHandlerSpy: ErrorHandlerService;
  let interceptor: ErrorInterceptor;
  let window: Window;

  beforeEach(() => {
    window = {
      location: {
        href: '',
      },
    } as unknown as Window;
    errorHandlerSpy = {
      err: jest.fn(),
    } as unknown as ErrorHandlerService;
    httpHandlerSpy = {
      handle: jest.fn(),
    } as unknown as HttpHandler;

    interceptor = new ErrorInterceptor(errorHandlerSpy, window);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: 'Window', useValue: window }],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('ErrorInterceptor 401 status', () => {
    it('should redirect to /auth/logout on 401 status', async () => {
      const mockHandler = {
        handle: jest.fn(() => of(new HttpResponse({ status: 401, body: { data: 'unauthorised' } }))),
      };

      const reqMock = new HttpRequest<unknown>('GET', '/api');
      interceptor.intercept(reqMock, mockHandler).subscribe();

      expect(window.location.href).toBe('/login');
    });

    it('should redirect to /auth/logout on 401 error response', () => {
      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.` },
        status: 401,
        statusText: 'Not Authorised',
      });
      jest.spyOn(httpHandlerSpy, 'handle').mockReturnValue(throwError(() => errorResponse));

      const reqMock = new HttpRequest<unknown>('GET', '/api');
      interceptor.intercept(reqMock, httpHandlerSpy).subscribe({
        next: (result) => console.log('good', result),
        error: (err) => {
          expect(err).toEqual(errorResponse);
          expect(window.location.href).toBe('/login');
        },
      });
    });
  });
});
