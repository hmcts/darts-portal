import { TestBed } from '@angular/core/testing';
import { CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CaseService } from '@services/case/case.service';
import { Observable, of } from 'rxjs';
import { expiredCaseGuard } from './expired-case.guard';

describe('expiredCaseGuard', () => {
  let caseServiceMock: any;
  let routerMock: any;

  const mockStateRouter = {
    url: '',
  } as unknown as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => expiredCaseGuard(...guardParameters));

  const prepareGuard = (isDataAnonymised: boolean) => {
    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CaseService,
          useValue: { getCase: jest.fn().mockReturnValue(of({ isDataAnonymised: isDataAnonymised })) },
        },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  };

  it('should return true if case data is not anonymised', () => {
    prepareGuard(false);
    const routeMock: any = { params: { caseId: '123' } };
    let canActivate: boolean | undefined;

    (executeGuard(routeMock, mockStateRouter) as Observable<boolean>).subscribe((result) => {
      canActivate = result;
    });

    expect(canActivate).toBeTruthy();
  });

  it('should return false and navigate to /expired-case if case data is anonymised', () => {
    prepareGuard(true);
    const routeMock: any = { params: { caseId: '123' } };
    let canActivate: boolean | undefined;

    (executeGuard(routeMock, mockStateRouter) as Observable<boolean>).subscribe((result) => {
      canActivate = result;
    });

    expect(canActivate).toBeFalsy();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/expired-case']);
  });
});
