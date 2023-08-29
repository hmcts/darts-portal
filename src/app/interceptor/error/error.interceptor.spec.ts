import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpClientSpy: HttpClient;
  let errorHandlerSpy: ErrorHandlerService;
  let interceptor: ErrorInterceptor;
  let window: Window;
  


  beforeEach(() => {
    window = {
      location: {
        href: '',
      },
    } as unknown as Window;

    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;
    errorHandlerSpy = {
      err: jest.fn(),
    } as unknown as ErrorHandlerService;


    interceptor = new ErrorInterceptor(errorHandlerSpy, window);
  });


  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
