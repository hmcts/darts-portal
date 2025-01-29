import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Event,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { DynatraceService } from '@services/dynatrace/dynatrace.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { HistoryService } from '@services/history/history.service';
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
  const fakeErrorMessageService = { clearErrorMessage: jest.fn() };

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEventsSubject: Subject<RouterEvent>;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    (fakeHeaderService.showNavigation as jest.Mock).mockClear();
    (fakeAppInsightsService.logPageView as jest.Mock).mockClear();
    (fakeUserService.refreshUserProfile as jest.Mock).mockClear();
    (fakeDtService.addDynatraceScript as jest.Mock).mockClear();
    routerEventsSubject = new Subject<RouterEvent>();
    mockRoute = {
      data: {},
    } as ActivatedRouteSnapshot;

    TestBed.configureTestingModule({
      imports: [HeaderComponent, ContentComponent, FooterComponent, AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HeaderService, useValue: fakeHeaderService },
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: UserService, useValue: fakeUserService },
        { provide: ActivatedRoute, useValue: { snapshot: mockRoute } },
        { provide: AppConfigService, useValue: fakeAppConfigService },
        { provide: DynatraceService, useValue: fakeDtService },
        { provide: ErrorMessageService, useValue: fakeErrorMessageService },
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

  it('clear error message from error message service on route change', () => {
    const url = '/something';
    jest.spyOn(fakeErrorMessageService, 'clearErrorMessage');
    const navigationEndEvent = new NavigationEnd(1, url, url);
    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationEndEvent as Event);
    routerEventsSubject.next(navigationEndEvent);

    expect(fakeErrorMessageService.clearErrorMessage).toHaveBeenCalled();
  });

  it('should add backUrl to history on NavigationStart event', () => {
    const url = '/something?backUrl=/previous';
    const navigationStartEvent = new NavigationStart(1, url);
    const historyService = TestBed.inject(HistoryService);
    const addBackUrlSpy = jest.spyOn(historyService, 'addBackUrl');
    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationStartEvent);
    routerEventsSubject.next(navigationStartEvent);

    expect(addBackUrlSpy).toHaveBeenCalledWith('/something', '/previous');
  });

  it('should not add backUrl to history if not present', () => {
    const url = '/something';
    const navigationStartEvent = new NavigationStart(1, url);
    const historyService = TestBed.inject(HistoryService);
    const addBackUrlSpy = jest.spyOn(historyService, 'addBackUrl');
    (TestBed.inject(Router).events as unknown as Subject<Event>).next(navigationStartEvent);
    routerEventsSubject.next(navigationStartEvent);

    expect(addBackUrlSpy).not.toHaveBeenCalled();
  });
});
