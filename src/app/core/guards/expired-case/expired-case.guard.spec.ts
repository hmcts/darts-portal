import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, UrlTree } from '@angular/router';
import { CaseService } from '@services/case/case.service';
import { Observable, of } from 'rxjs';
import { expiredCaseGuard } from './expired-case.guard';

describe('expiredCaseGuard', () => {
  const routerMock = {
    parseUrl: jest.fn((url: string) => ({ url }) as unknown as UrlTree),
  } as unknown as Router;

  const mockStateRouter = {
    url: '',
  } as unknown as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => expiredCaseGuard(...guardParameters));

  const prepareGuard = (isDataAnonymised: boolean) => {
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
    const routeMock = { params: { caseId: '123' } } as unknown as ActivatedRouteSnapshot;
    let canActivate: boolean | undefined;

    (executeGuard(routeMock, mockStateRouter) as Observable<boolean>).subscribe((result) => {
      canActivate = result;
    });

    expect(canActivate).toBeTruthy();
  });

  it('should redirect to /expired-case if case data is anonymised', () => {
    prepareGuard(true);
    const routeMock = { params: { caseId: '123' } } as unknown as ActivatedRouteSnapshot;
    let canActivate: boolean | UrlTree | undefined;

    (executeGuard(routeMock, mockStateRouter) as Observable<boolean | UrlTree>).subscribe((result) => {
      canActivate = result;
    });

    expect(routerMock.parseUrl).toHaveBeenCalledWith('/expired-case');
    expect(canActivate).toEqual({ url: '/expired-case' });
  });
});
