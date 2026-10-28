import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
import { UserService } from '@services/user/user.service';
import { Observable, of, Subject } from 'rxjs';
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
        { provide: FeatureFlagService, useValue: { loadUserFlags: jest.fn(() => of(undefined)), reset: jest.fn() } },
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
            parseUrl: jest.fn((url: string) => ({ url }) as unknown as UrlTree),
          },
        },
        {
          provide: UserService,
          useValue: {
            userProfile$: of({ userId: 123, email_address: 'user@example.test' }),
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

  it('should redirect to login if not authenticated', () => {
    prepareGuard({ checkAuthenticated: false });
    const router = TestBed.inject(Router);
    let canActivate: boolean | UrlTree | undefined;

    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean | UrlTree>).subscribe((result) => {
      canActivate = result;
    });

    expect(router.parseUrl).toHaveBeenCalledWith('/login');
    expect(canActivate).toEqual({ url: '/login' });
  });

  it('should clear feature flags state when the session is no longer authenticated', () => {
    prepareGuard({ checkAuthenticated: false });
    const featureFlagService = TestBed.inject(FeatureFlagService);

    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<UrlTree>).subscribe();

    expect(featureFlagService.reset).toHaveBeenCalled();
  });

  it("should wait for the current user's feature flag values to be ready to use before allowing navigation", () => {
    prepareGuard({ checkAuthenticated: true });
    const featureFlagService = TestBed.inject(FeatureFlagService);
    const userFlagsReadyToUse = new Subject<void>();
    jest.spyOn(featureFlagService, 'loadUserFlags').mockReturnValue(userFlagsReadyToUse);
    const result = jest.fn();

    (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean>).subscribe(result);

    expect(featureFlagService.loadUserFlags).toHaveBeenCalledWith(123);
    expect(result).not.toHaveBeenCalled();
    // Ready means the page can use LaunchDarkly values, cached values, or defaults. The loadUserFlags function
    // will determine which to use and let this function know the user can procceed. It may update values in
    // the background for later use.
    userFlagsReadyToUse.next();
    expect(result).toHaveBeenCalledWith(true);
    userFlagsReadyToUse.complete();
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

    it('should redirect to forbidden page if authenticated and user does not have required role', () => {
      prepareGuard({ checkAuthenticated: true, hasRoles: false });
      const router = TestBed.inject(Router);
      mockRouteSnapshot.data.allowedRoles = ['APPROVER'];
      let canActivate: boolean | UrlTree | undefined;
      (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean | UrlTree>).subscribe((result) => {
        canActivate = result;
      });
      expect(router.parseUrl).toHaveBeenCalledWith('/forbidden');
      expect(canActivate).toEqual({ url: '/forbidden' });
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

    it('should redirect to page not found if authenticated and user does not have required role', () => {
      prepareGuard({ checkAuthenticated: true, hasGlobalRoles: false });
      const router = TestBed.inject(Router);
      mockRouteSnapshot.data.allowedRoles = ['SUPER_ADMIN'];
      let canActivate: boolean | UrlTree | undefined;
      (executeGuard(mockRouteSnapshot, mockStateRouter) as Observable<boolean | UrlTree>).subscribe((result) => {
        canActivate = result;
      });
      expect(router.parseUrl).toHaveBeenCalledWith('/page-not-found');
      expect(canActivate).toEqual({ url: '/page-not-found' });
    });
  });
});
