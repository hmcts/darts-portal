import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authService: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let windowSpy: Window;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    windowSpy = {
      location: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        reload: () => {},
      },
    } as Window;
    authService = new AuthService(httpClientSpy, routerSpy, windowSpy as Window);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('#isAuthenticated', () => {
    it('true', async () => {
      httpClientSpy.get.and.returnValue(of({}));
      expect(await authService.checkAuthenticated()).toBeTrue();
    });

    it('false', async () => {
      httpClientSpy.get.and.returnValue(of());
      expect(await authService.checkAuthenticated()).toBeFalsy();
    });
  });
});
