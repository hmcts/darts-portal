import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppInsightsService } from 'src/app/services/app-insights/app-insights.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const fakeAppInsightsService = {};
    fakeAuthService = {
      isAuthenticated: jasmine.createSpy().and.resolveTo(true),
      logout: jasmine.createSpy().and.resolveTo(),
    };

    await TestBed.configureTestingModule({
      imports: [MatIconModule, ReactiveFormsModule],
      declarations: [HeaderComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fakeAuthService.isAuthenticated).toHaveBeenCalled();
  });

  it('logout', async () => {
    expect(component).toBeTruthy();
    await component.logout();
    expect(fakeAuthService.logout).toHaveBeenCalledTimes(1);
  });
});
