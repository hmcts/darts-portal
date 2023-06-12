import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authService: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    authService = new AuthService(httpClientSpy, routerSpy);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('#isAuthenticated', () => {
    it('true', async () => {
      httpClientSpy.get.and.returnValue(of({}));
      expect(await authService.isAuthenticated()).toBeTrue();
    });

    it('false', async () => {
      httpClientSpy.get.and.returnValue(of());
      expect(await authService.isAuthenticated()).toBeFalsy();
    });
  });

  describe('#logout', () => {
    it('redirects to login page', async () => {
      httpClientSpy.get.and.returnValue(of({}));
      await authService.logout();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('does not redirect to login page if it fails', async () => {
      httpClientSpy.get.and.returnValue(of());
      await authService.logout();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalledWith('/login');
    });
  });
});
