import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let httpClientSpy: HttpClient;
  let authService: AuthService;
  let routerSpy: Router;
  let windowSpy: Window;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    } as unknown as HttpClient;
    routerSpy = {
      'navigateByUrl': jest.fn()
    } as unknown as Router;
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
      jest.spyOn(httpClientSpy, 'get').mockReturnValue(of({}));
      expect(await authService.checkAuthenticated()).toBeTruthy();
    });

    it('false', async () => {
      jest.spyOn(httpClientSpy, 'get').mockReturnValue(of({}));
      expect(await authService.checkAuthenticated()).toBeTruthy();
    });
  });
});
