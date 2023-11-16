import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { ErrorMessageService } from './error-message.service';

describe('ErrorMessageService', () => {
  let service: ErrorMessageService;
  let mockRouter: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HeaderService] });
    service = TestBed.inject(ErrorMessageService);
    mockRouter = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Subscribed endpoint error handling', () => {
    it('should not change route on the subscribed endpoints, for transcriptions', () => {
      const error = new HttpErrorResponse({ status: 409, url: '/api/transcriptions' });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');
      service.handleErrorMessage(error);
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not change route on the subscribed endpoints, for audio playback', () => {
      const error = new HttpErrorResponse({ status: 403, url: '/api/audio-requests/playback' });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');
      service.handleErrorMessage(error);
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not change route on the subscribed endpoints, for case search', () => {
      const error = new HttpErrorResponse({ status: 500, url: '/api/cases/search' });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');
      service.handleErrorMessage(error);
      expect(navigateSpy).not.toHaveBeenCalled();

      const error1 = new HttpErrorResponse({ status: 400, url: '/api/cases/search' });
      service.handleErrorMessage(error1);
      expect(navigateSpy).not.toHaveBeenCalled();

      const error2 = new HttpErrorResponse({ status: 204, url: '/api/cases/search' });
      service.handleErrorMessage(error2);
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('Global error handling', () => {
    it('should route to internal-error page on 500 response', () => {
      const error = new HttpErrorResponse({ status: 500 });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');

      service.handleErrorMessage(error);

      expect(navigateSpy).toHaveBeenCalledWith('internal-error');
    });

    it('should route to forbidden page on 403 response', () => {
      const error = new HttpErrorResponse({ status: 403 });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');

      service.handleErrorMessage(error);

      expect(navigateSpy).toHaveBeenCalledWith('forbidden');
    });

    it('should route to not found page on 404 response', () => {
      const error = new HttpErrorResponse({ status: 404 });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');

      service.handleErrorMessage(error);

      expect(navigateSpy).toHaveBeenCalledWith('page-not-found');
    });

    it('should route to internal-error page on unhandled error response, e.g. 409', () => {
      const error = new HttpErrorResponse({ status: 409 });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');

      service.handleErrorMessage(error);

      expect(navigateSpy).toHaveBeenCalledWith('internal-error');
    });
  });
});
