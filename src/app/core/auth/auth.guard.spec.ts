import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/core/services/user/user.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const mockRouteSnapshot = {
    data: {
      allowedRoles: null,
    },
  } as unknown as ActivatedRouteSnapshot;

  const mockStateRouter = {
    url: '',
  } as unknown as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const prepareGuard = (checkAuthenticated: boolean, hasRoles?: boolean) => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            userProfile$: of({}),
            hasRoles: jest.fn().mockReturnValue(hasRoles),
          },
        },
        {
          provide: AuthService,
          useValue: { checkIsAuthenticated: () => of(checkAuthenticated) },
        },
      ],
    });
  };

  it('should return true if authenticated', () => {
    prepareGuard(true);
    let canActivate: boolean | undefined;
    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
      canActivate = isAuthenticated;
    });
    expect(canActivate).toBeTruthy();
  });

  it('should return false if not authenticated', () => {
    prepareGuard(false);
    let canActivate: boolean | undefined;
    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
      canActivate = isAuthenticated;
    });
    expect(canActivate).toBeFalsy();
  });

  it('should return true if authenticated and user has required role', () => {
    prepareGuard(true, true);
    mockRouteSnapshot.data.allowedRoles = ['APPROVER'];
    let canActivate: boolean | undefined;
    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
      canActivate = isAuthenticated;
    });
    expect(canActivate).toBeTruthy();
  });

  it('should return false if athenticated and user does not have required role', () => {
    prepareGuard(true, false);
    mockRouteSnapshot.data.allowedRoles = ['APPROVER'];
    let canActivate: boolean | undefined;
    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
      canActivate = isAuthenticated;
    });
    expect(canActivate).toBeFalsy();
  });

  it('should navigate to forbidden page if user is authenticated but does not have required role', () => {
    prepareGuard(true, false);
    const spy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');
    mockRouteSnapshot.data.allowedRoles = ['APPROVER'];

    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe();

    expect(spy).toHaveBeenCalledWith('forbidden');
  });
});
