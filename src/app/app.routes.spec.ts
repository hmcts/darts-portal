import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AuthService } from './services/auth/auth.service';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  let mockAuthService: AuthService;

  beforeEach(() => {
    mockAuthService = { checkAuthenticated: jest.fn() } as unknown as AuthService;
    jest.spyOn(mockAuthService, 'checkAuthenticated').mockResolvedValue(true);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(APP_ROUTES)],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  APP_ROUTES.forEach((route: Route) => {
    it(`navigate to "${route.path}" takes you to "/${route.path}"`, async () => {
      await router.navigate([route.path]);
      expect(location.path()).toEqual(`/${route.path}`);
    });
  });
});
