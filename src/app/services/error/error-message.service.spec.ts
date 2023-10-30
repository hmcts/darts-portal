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

  it('should route to internal-error page on 500 response', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const navigateSpy = jest.spyOn(mockRouter, 'navigateByUrl');

    service.handleErrorMessage(error);

    expect(navigateSpy).toHaveBeenCalledWith('internal-error');
  });
});
