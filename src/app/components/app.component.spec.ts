import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { AuthService } from '@services/auth/auth.service';
import { AppComponent } from './app.component';
import { ContentComponent } from './layout/content/content.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { PhaseBannerComponent } from './layout/phase-banner/phase-banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  const fakeAppInsightsService = {};
  const fakeAuthService = {};
  const fakeHeaderService = { showPrimaryNavigation: jest.fn() } as unknown as HeaderService;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEventsSubject: Subject<NavigationEnd>;

  beforeEach(() => {
    routerEventsSubject = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        PhaseBannerComponent,
        ContentComponent,
        FooterComponent,
        AppComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: HeaderService, useValue: fakeHeaderService },
        { provide: Router, useValue: { events: routerEventsSubject } },
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
    const navigationEndEvent = new NavigationEnd(1, '/', '/');
    jest.spyOn(fakeHeaderService, 'showPrimaryNavigation');

    routerEventsSubject.next(navigationEndEvent);

    expect(fakeHeaderService.showPrimaryNavigation).toHaveBeenCalledWith(true);
  });
});
