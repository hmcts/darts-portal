import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AuthService } from './services/auth/auth.service';
import { UserService } from '@services/user/user.service';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  let mockAuthService: AuthService;
  let mockUserService: UserService;

  beforeEach(() => {
    mockAuthService = { checkAuthenticated: jest.fn() } as unknown as AuthService;
    jest.spyOn(mockAuthService, 'checkAuthenticated').mockResolvedValue(true);

    mockUserService = { getUserProfile: jest.fn() } as unknown as UserService;
    jest.spyOn(mockUserService, 'getUserProfile').mockResolvedValue({ userId: 123, userName: 'Dean', roles: [] });

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

  APP_ROUTES.filter((route) => route.path !== '**').forEach((route: Route) => {
    it(`navigate to "${route.path}" takes you to "/${route.path}"`, async () => {
      await router.navigate([route.path]);
      expect(location.path()).toEqual(`/${route.path}`);
    });
  });

  it(`404 should navigate to page not found`, async () => {
    await router.navigate(['asdasdfsdfs']);
    expect(location.path()).toEqual('/page-not-found');
  });
});
