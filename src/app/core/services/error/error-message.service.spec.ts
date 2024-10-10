import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorMessage } from '@core-types/index';
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

  describe('Subscribed endpoints error handling', () => {
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

  describe('Ignored endpoints error handling', () => {
    it('should not change route on the ignored endpoints, for not-accessed-count', () => {
      const error = new HttpErrorResponse({ status: 500, url: '/api/audio-requests/not-accessed-count' });
      const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');
      service.handleErrorMessage(error);
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
  });

  describe('updateDisplayType', () => {
    it('should update the display type of the current error message to PAGE', () => {
      const errorMessage: ErrorMessage = { status: 500, statusText: 'Internal Server Error', display: 'COMPONENT' };
      service.setErrorMessage(errorMessage);

      service.updateDisplayType('PAGE');

      const updatedErrorMessage = service['errorMessage'].getValue();
      expect(updatedErrorMessage?.display).toBe('PAGE');
    });

    it('should update the display type of the current error message to COMPONENT', () => {
      const errorMessage: ErrorMessage = { status: 500, statusText: 'Internal Server Error', display: 'PAGE' };
      service.setErrorMessage(errorMessage);

      service.updateDisplayType('COMPONENT');

      const updatedErrorMessage = service['errorMessage'].getValue();
      expect(updatedErrorMessage?.display).toBe('COMPONENT');
    });

    it('should not update the display type if there is no current error message', () => {
      service.clearErrorMessage();

      service.updateDisplayType('PAGE');

      const updatedErrorMessage = service['errorMessage'].getValue();
      expect(updatedErrorMessage).toBeNull();
    });
  });
  describe('handleErrorMessage', () => {
    it('should set error message and handle other pages for a given error', () => {
      const error = new HttpErrorResponse({ status: 500, error: 'Internal Server Error' });
      const setErrorMessageSpy = jest.spyOn(service, 'setErrorMessage');
      const handleOtherPagesSpy = jest.spyOn(
        service as unknown as { handleOtherPages: (error: HttpErrorResponse) => void },
        'handleOtherPages'
      );

      service.handleErrorMessage(error);

      expect(setErrorMessageSpy).toHaveBeenCalledWith({ status: 500, detail: 'Internal Server Error' });
      expect(handleOtherPagesSpy).toHaveBeenCalledWith(error);
    });

    it('should not set error message if error.error is not present', () => {
      const error = new HttpErrorResponse({ status: 500 });
      const setErrorMessageSpy = jest.spyOn(service, 'setErrorMessage');
      const handleOtherPagesSpy = jest.spyOn(
        service as unknown as { handleOtherPages: (error: HttpErrorResponse) => void },
        'handleOtherPages'
      );

      service.handleErrorMessage(error);

      expect(setErrorMessageSpy).not.toHaveBeenCalled();
      expect(handleOtherPagesSpy).toHaveBeenCalledWith(error);
    });

    it('should handle other pages for a given error', () => {
      const error = new HttpErrorResponse({ status: 404, error: 'Not Found' });
      const handleOtherPagesSpy = jest.spyOn(
        service as unknown as { handleOtherPages: (error: HttpErrorResponse) => void },
        'handleOtherPages'
      );

      service.handleErrorMessage(error);

      expect(handleOtherPagesSpy).toHaveBeenCalledWith(error);
    });
  });
});
