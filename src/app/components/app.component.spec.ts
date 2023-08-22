import { TestBed } from '@angular/core/testing';
import { AppInsightsService } from '../services/app-insights/app-insights.service';
import { AuthService } from '../services/auth/auth.service';
import { AppComponent } from './app.component';
import { ContentComponent } from './layout/content/content.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { PhaseBannerComponent } from './layout/phase-banner/phase-banner.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const fakeAppInsightsService = {};
    const fakeAuthService = {};

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, PhaseBannerComponent, ContentComponent, FooterComponent, AppComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'DARTS portal'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('DARTS portal');
  });
});
