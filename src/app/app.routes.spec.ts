import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { APP_ROUTES } from './app.routes';
import { AuthService } from './services/auth/auth.service';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  let mockAuthService: AuthService;
  let mockUserService: Partial<UserService>;

  beforeEach(() => {
    mockAuthService = { checkAuthenticated: jest.fn() } as unknown as AuthService;
    jest.spyOn(mockAuthService, 'checkAuthenticated').mockResolvedValue(true);

    mockUserService = { userProfile$: of({ userId: 123, userName: 'Dean', roles: [] }) };

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
    router.initialNavigation();
  });
  APP_ROUTES.filter((route) => !route.redirectTo).forEach((route: Route) => {
    it(`navigate to "${route.path}" takes you to "/${route.path}"`, async () => {
      await router.navigate([route.path]);
      expect(location.path()).toEqual(`/${route.path}`);
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
