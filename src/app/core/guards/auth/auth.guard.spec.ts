import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { Observable, of } from 'rxjs';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockRouteSnapshot: ActivatedRouteSnapshot;

  const mockStateRouter = {
    url: '',
  } as unknown as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const prepareGuard = ({
    checkAuthenticated,
    hasRoles,
    hasGlobalRoles,
  }: {
    checkAuthenticated: boolean;
    hasRoles?: boolean;
    hasGlobalRoles?: boolean;
  }) => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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
            hasGlobalRoles: jest.fn().mockReturnValue(hasGlobalRoles),
          },
        },
        {
          provide: AuthService,
          useValue: { checkIsAuthenticated: () => of(checkAuthenticated) },
        },
      ],
    });
  };

  beforeEach(() => {
    mockRouteSnapshot = {
      data: {
        allowedRoles: null,
      },
      url: [new UrlSegment('some', {}), new UrlSegment('path', {})],
    } as unknown as ActivatedRouteSnapshot;
  });

  it('should return true if authenticated', () => {
    prepareGuard({ checkAuthenticated: true });
    let canActivate: boolean | undefined;
    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
      canActivate = isAuthenticated;
    });
    expect(canActivate).toBeTruthy();
  });

  it('should return false if not authenticated', () => {
    prepareGuard({ checkAuthenticated: false });
    let canActivate: boolean | undefined;
    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
      canActivate = isAuthenticated;
    });
    expect(canActivate).toBeFalsy();
  });

  describe('non-admin routes', () => {
    it('should return true if authenticated and user has required role', () => {
      prepareGuard({ checkAuthenticated: true, hasRoles: true });
      mockRouteSnapshot.data.allowedRoles = ['APPROVER'];
      let canActivate: boolean | undefined;
      (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
        canActivate = isAuthenticated;
      });
      expect(canActivate).toBeTruthy();
    });

    it('should return false and redirect to forbidden page if authenticated and user does not have required role', () => {
      prepareGuard({ checkAuthenticated: true, hasRoles: false });
      const spy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');
      mockRouteSnapshot.data.allowedRoles = ['APPROVER'];
      let canActivate: boolean | undefined;
      (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
        canActivate = isAuthenticated;
      });
      expect(canActivate).toBeFalsy();
      expect(spy).toHaveBeenCalledWith('forbidden');
    });
  });

  describe('admin routes', () => {
    beforeEach(() => {
      mockRouteSnapshot.url = [new UrlSegment('admin', {}), new UrlSegment('some', {}), new UrlSegment('path', {})];
    });

    it('should return true if authenticated and user has required global role', () => {
      prepareGuard({ checkAuthenticated: true, hasGlobalRoles: true });
      mockRouteSnapshot.data.allowedRoles = ['SUPER_ADMIN'];
      let canActivate: boolean | undefined;
      (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
        canActivate = isAuthenticated;
      });
      expect(canActivate).toBeTruthy();
    });

    it('should return false and redirect to page not found if authenticated and user does not have required role', () => {
      prepareGuard({ checkAuthenticated: true, hasGlobalRoles: false });
      const spy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');
      mockRouteSnapshot.data.allowedRoles = ['SUPER_ADMIN'];
      let canActivate: boolean | undefined;
      (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe((isAuthenticated) => {
        canActivate = isAuthenticated;
      });
      expect(canActivate).toBeFalsy();
      expect(spy).toHaveBeenCalledWith('page-not-found');
    });
  });
});
