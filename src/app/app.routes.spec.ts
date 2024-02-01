import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserState } from '@darts-types/user-state';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs/internal/observable/of';
import { APP_ROUTES } from './app.routes';
import { AuthService } from './services/auth/auth.service';

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

  APP_ROUTES.filter((route) => route.data?.allowedRoles && route.data?.allowedRoles === 'ADMIN').forEach(
    (route: Route) => {
      it(`navigate to "${route.path}" redirects to "/forbidden" if user does not have the required role`, async () => {
        jest.spyOn(mockUserService, 'hasRoles').mockReturnValue(false);
        await router.navigate([route.path]);
        expect(location.path()).toEqual('/forbidden');
      });
    }
  );

  APP_ROUTES.filter((route) => route.data?.allowedRoles === 'ADMIN').forEach((route: Route) => {
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
