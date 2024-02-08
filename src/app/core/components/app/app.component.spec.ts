import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { ContentComponent } from '../layout/content/content.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderComponent } from '../layout/header/header.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const fakeAuthService = {};
  const fakeHeaderService = { showNavigation: jest.fn() } as unknown as HeaderService;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEventsSubject: Subject<NavigationEnd>;

  beforeEach(() => {
    routerEventsSubject = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        ContentComponent,
        FooterComponent,
        AppComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: HeaderService, useValue: fakeHeaderService },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'DARTS portal'`, () => {
    expect(component.title).toEqual('DARTS portal');
  });

  it('should show primary navigation on NavigationEnd event', () => {
    jest.spyOn(fakeHeaderService, 'showNavigation');
    const navigationEndEvent = new NavigationEnd(1, '/', '/');

    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(fakeHeaderService.showNavigation).toHaveBeenCalled();
  });

  it('should set current URL NavigationEnd event', () => {
    jest.spyOn(fakeHeaderService, 'showNavigation');
    const navigationEndEvent = new NavigationEnd(1, '/test', '/test');

    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(component.currentUrl).toBe('/test');
  });

  it('should set current URL NavigationEnd event, without fragment', () => {
    jest.spyOn(fakeHeaderService, 'showNavigation');
    const navigationEndEvent = new NavigationEnd(1, '/test#content', '/test#content');

    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(component.currentUrl).toBe('/test');
  });
});
