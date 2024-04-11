import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Event, NavigationEnd, Router } from '@angular/router';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { DynatraceService } from '@services/dynatrace/dynatrace.service';
import { HeaderService } from '@services/header/header.service';
import { UserService } from '@services/user/user.service';
import { Subject } from 'rxjs';
import { ContentComponent } from '../layout/content/content.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderComponent } from '../layout/header/header.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const fakeHeaderService = { showNavigation: jest.fn() } as unknown as HeaderService;
  const fakeAppInsightsService = { logPageView: jest.fn() } as unknown as AppInsightsService;
  const fakeAppConfigService = { getAppConfig: jest.fn() } as unknown as AppConfigService;
  const fakeUserService = { refreshUserProfile: jest.fn() } as unknown as UserService;
  const fakeDtService = { addDynatraceScript: jest.fn() } as unknown as DynatraceService;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEventsSubject: Subject<NavigationEnd>;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    (fakeHeaderService.showNavigation as jest.Mock).mockClear();
    (fakeAppInsightsService.logPageView as jest.Mock).mockClear();
    (fakeUserService.refreshUserProfile as jest.Mock).mockClear();
    (fakeDtService.addDynatraceScript as jest.Mock).mockClear();
    routerEventsSubject = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      imports: [HeaderComponent, ContentComponent, FooterComponent, AppComponent, HttpClientTestingModule],
      providers: [
        { provide: HeaderService, useValue: fakeHeaderService },
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: UserService, useValue: fakeUserService },
        { provide: ActivatedRoute, useValue: { snapshot: mockRoute } },
        { provide: AppConfigService, useValue: fakeAppConfigService },
        { provide: DynatraceService, useValue: fakeDtService },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
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

  it('should set current URL on NavigationEnd event', () => {
    const navigationEndEvent = new NavigationEnd(1, '/test', '/test');
    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(component.currentUrl).toBe('/test');
  });

  it('should set current URL on NavigationEnd event, without fragment', () => {
    const navigationEndEvent = new NavigationEnd(1, '/test#content', '/test#content');
    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(component.currentUrl).toBe('/test');
  });

  it('should log page view on NavigationEnd event', () => {
    const url = '/something';
    jest.spyOn(fakeAppInsightsService, 'logPageView');
    const navigationEndEvent = new NavigationEnd(1, url, url);

    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(fakeAppInsightsService.logPageView).toHaveBeenCalledWith(url, url);
  });

  it('should refresh user profile NavigationEnd event', () => {
    const url = '/something';
    jest.spyOn(fakeUserService, 'refreshUserProfile');
    const navigationEndEvent = new NavigationEnd(1, url, url);

    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(fakeUserService.refreshUserProfile).toHaveBeenCalled();
  });
});
