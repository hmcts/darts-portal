import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common'
import { Route, Router } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AuthService } from './services/auth/auth.service';


describe('App Routes', () => {
    let router: Router;
    let location: Location;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(APP_ROUTES)],
            providers: [{
                provide: AuthService,
                useValue: { checkAuthenticated: async () => Promise.resolve(true) },
            },]
        });

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);

        router.initialNavigation();
    });

    APP_ROUTES.forEach((route: Route) => {
        it(`navigate to "${route.path}" takes you to "/${route.path}"`, fakeAsync(() => {
            router.navigate([route.path]);
            tick();
            expect(location.path()).toBe(`/${route.path}`);
        }));
    })
});