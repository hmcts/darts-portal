import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Event, NavigationEnd, Router } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { Subject } from 'rxjs';
import { ContentComponent } from '../layout/content/content.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderComponent } from '../layout/header/header.component';
import { AppComponent } from './app.component';
import { AppInsightsService } from '@services/app-insights/app-insights.service';

describe('AppComponent', () => {
  const fakeHeaderService = { showNavigation: jest.fn() } as unknown as HeaderService;
  const fakeAppInsightsService = { logPageView: jest.fn() } as unknown as AppInsightsService;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEventsSubject: Subject<NavigationEnd>;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    (fakeHeaderService.showNavigation as jest.Mock).mockClear();
    (fakeAppInsightsService.logPageView as jest.Mock).mockClear();
    routerEventsSubject = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      imports: [HeaderComponent, ContentComponent, FooterComponent, AppComponent, HttpClientTestingModule],
      providers: [
        { provide: HeaderService, useValue: fakeHeaderService },
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: ActivatedRoute, useValue: { snapshot: mockRoute } },
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
});
