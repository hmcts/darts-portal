import { HttpClient, HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { ErrorInterceptor } from './error.interceptor';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CaseData } from 'src/app/types/case';
import { CaseService } from 'src/app/services/case/case.service';

describe('ErrorInterceptor', () => {
  let httpClientSpy: HttpClient;
  let errorHandlerSpy: ErrorHandlerService;
  let interceptor: ErrorInterceptor;
  let window: Window;
  let service: CaseService;

  beforeEach(() => {
    window = {
      location: {
        href: '',
      },
    } as unknown as Window;
    errorHandlerSpy = {
      err: jest.fn(),
    } as unknown as ErrorHandlerService;
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    interceptor = new ErrorInterceptor(errorHandlerSpy, window);
    service = new CaseService(httpClientSpy, errorHandlerSpy);

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

    it('should redirect to /auth/logout on 401 status errors', async () => {
      jest.spyOn(service, 'getCasesAdvanced').mockReturnValue(throwError(() => errorResponse));

      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.` },
        status: 401,
        statusText: 'Not Authorised',
      });

      let cases: CaseData[] = [];
      service.getCasesAdvanced('zzzz').subscribe(
        (result: CaseData[]) => {
          if (result) {
            cases = result;
          }
        },
        (error: HttpErrorResponse) => {
          expect(error).toBeTruthy();
          if (error.status) {
            expect(error.status).toEqual(401);
            expect(window.location.href).toBe('/auth/logout');
          }
        }
      );
    });
  });
});
