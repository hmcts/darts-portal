import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserState } from '@core-types/user/user-state.interface';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs/internal/observable/of';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { APP_ROUTES } from './app.routes';
import { AuthService } from './core/services/auth/auth.service';
import { PORTAL_ROUTES } from './portal/portal.routes';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  let mockAuthService: AuthService;
  let mockUserService: Partial<UserService>;
  const userStateSignal = signal<UserState | null>(null);

  beforeEach(() => {
    mockAuthService = {
      checkIsAuthenticated: () => of(true),
      getAuthenticated: jest.fn(),
    } as unknown as AuthService;

    mockUserService = {
      userProfile$: of({ userId: 123, userName: 'Dean', roles: [{ roleId: 1, roleName: 'APPROVER' }] }),
      hasRoles: jest.fn(),
      userState: userStateSignal,
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(APP_ROUTES)],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    mockUserService.userState?.set({ userId: 123, userName: 'Dean', roles: [{ roleId: 1, roleName: 'APPROVER' }] });
    router.initialNavigation();
  });

  APP_ROUTES.filter((route) => !route.redirectTo).forEach((route: Route) => {
    it(`navigate to "${route.path}" takes you to "/${route.path}" if user has roles`, async () => {
      jest.spyOn(mockUserService, 'hasRoles').mockReturnValue(true);
      await router.navigate([route.path]);
      expect(location.path()).toEqual(`/${route.path}`);
    });
  });

  // All role protected portal routes should redirect to forbidden if user does not have the required role
  PORTAL_ROUTES.filter((route) => route.data?.allowedRoles).forEach((route: Route) => {
    it(`navigate to "${route.path}" redirects to "/forbidden" if user does not have the required role for non-admin route`, async () => {
      jest.spyOn(mockUserService, 'hasRoles').mockReturnValue(false);
      await router.navigate([route.path]);
      expect(location.path()).toEqual('/forbidden');
    });
  });

  // All admin routes should redirect to page not found if user does not have the admin role
  ADMIN_ROUTES.forEach((route: Route) => {
    it(`navigate to "${route.path}" redirects to "/page-not-found" if user does not have the admin role`, async () => {
      jest.spyOn(mockUserService, 'hasRoles').mockReturnValue(false);
      await router.navigate([route.path]);
      expect(location.path()).toEqual('/page-not-found');
    });
  });

  it(`navigate to "" takes you to "/search"`, async () => {
    const emptyPath = APP_ROUTES.find((route) => route.path === '');
    await router.navigate([emptyPath?.path]);
    expect(location.path()).toEqual(`/search`);
  });

  it(`404 should navigate to page not found`, async () => {
    await router.navigate(['asdasdfsdfs']);
    expect(location.path()).toEqual('/page-not-found');
  });
});
