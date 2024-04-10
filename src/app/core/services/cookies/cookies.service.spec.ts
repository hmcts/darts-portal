import { TestBed } from '@angular/core/testing';

import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from './cookies.service';

describe('CookiesService', () => {
  let service: CookiesService;
  let mockCookieService: jest.Mocked<CookieService>;

  beforeEach(() => {
    mockCookieService = {
      delete: jest.fn(),
      check: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      // Add other methods as needed for your tests
    } as unknown as jest.Mocked<CookieService>;
    TestBed.configureTestingModule({
      providers: [{ provide: CookieService, useValue: mockCookieService }],
    });
    service = TestBed.inject(CookiesService);
  });

  describe('deleteAppInsightsCookies', () => {
    it('should delete all AppInsights cookies', () => {
      service.deleteAppInsightsCookies();
      expect(mockCookieService.delete).toHaveBeenCalledWith('ai_user');
      expect(mockCookieService.delete).toHaveBeenCalledWith('ai_session');
      expect(mockCookieService.delete).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteDynatraceCookies', () => {
    it('should delete all Dynatrace cookies', () => {
      service.deleteDynatraceCookies();
      expect(mockCookieService.delete).toHaveBeenCalledWith(expect.any(String));
      expect(mockCookieService.delete).toHaveBeenCalledTimes(service.dyntraceCookies.length);
    });
  });

  describe('getCookiePolicy', () => {
    it('should return the current cookie policy if exists', () => {
      mockCookieService.check.mockReturnValue(true);
      mockCookieService.get.mockReturnValue(
        JSON.stringify({ appInsightsCookiesEnabled: true, dynatraceCookiesEnabled: false })
      );

      const policy = service.getCookiePolicy();
      expect(policy).toEqual({ appInsightsCookiesEnabled: true, dynatraceCookiesEnabled: false });
      expect(mockCookieService.check).toHaveBeenCalledWith('cookie_policy');
    });

    it('should return a default policy if no cookie policy is set', () => {
      mockCookieService.check.mockReturnValue(false);

      const policy = service.getCookiePolicy();
      expect(policy).toEqual({ appInsightsCookiesEnabled: false, dynatraceCookiesEnabled: false });
    });
  });

  describe('setCookiePolicy', () => {
    it('should set the cookie policy and delete cookies based on the policy', () => {
      const expiryDate = expect.any(Date);

      // Spy on the service's methods
      const deleteDynatraceCookiesSpy = jest.spyOn(service, 'deleteDynatraceCookies');
      const deleteAppInsightsCookiesSpy = jest.spyOn(service, 'deleteAppInsightsCookies');

      service.setCookiePolicy(true, false);

      expect(mockCookieService.set).toHaveBeenCalledWith(
        'cookie_policy',
        JSON.stringify({ appInsightsCookiesEnabled: true, dynatraceCookiesEnabled: false }),
        { expires: expiryDate, path: '/', sameSite: 'Strict' }
      );

      expect(deleteDynatraceCookiesSpy).toHaveBeenCalled();
      expect(deleteAppInsightsCookiesSpy).not.toHaveBeenCalled();
    });
  });
});
