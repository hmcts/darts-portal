import { HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { ErrorInterceptor } from './error.interceptor';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('ErrorInterceptor', () => {
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

      const reqMock = new HttpRequest<any>('GET', '/api');
      interceptor.intercept(reqMock, mockHandler).subscribe();

      expect(window.location.href).toBe('/auth/logout');
    });
  });
});
