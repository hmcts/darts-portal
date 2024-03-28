import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { AuthService } from '@services/auth/auth.service';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';

@Component({ template: '' })
class DummyComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserService: Partial<UserService>;
  let fakeCountService: Partial<CountNotificationService>;
  let router: Router;

  beforeEach(async () => {
    const fakeAppInsightsService = {};
    fakeAuthService = {
      getAuthenticated: jest.fn(() => true),
    };
    fakeCountService = { assignedTranscripts$: of(3), unassignedTranscripts$: of(2), unreadAudio$: of(1) };
    fakeUserService = {
      isTranscriber: jest.fn(() => false),
      isJudge: jest.fn(() => false),
      isApprover: jest.fn(() => false),
      isRequester: jest.fn(() => false),
      isAdmin: jest.fn(() => false),
      isSuperUser: jest.fn(() => false),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'admin', component: DummyComponent }]), HeaderComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: CountNotificationService, useValue: fakeCountService },
        { provide: UserService, useValue: fakeUserService },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fakeAuthService.getAuthenticated).toHaveBeenCalled();
  });

  it('should set unread audio count', () => {
    const unreadCountElement: HTMLSpanElement = fixture.debugElement.query(
      By.css('#unreadAudioCountNotifications')
    ).nativeElement;
    expect(unreadCountElement.textContent).toBe('Ready requests not viewed count: 1');
  });

  describe('when user IS authenticated', () => {
    it('show "Sign out" link in navigation', () => {
      const logOutLink = fixture.debugElement.query(By.css('#logout-link'));
      expect(logOutLink).toBeTruthy();
    });
  });

  describe('when user IS NOT authenticated', () => {
    it('does not show "Sign out" link in navigation', () => {
      fakeAuthService.getAuthenticated = jest.fn(() => false);
      fixture.detectChanges();
      const logOutLink = fixture.debugElement.query(By.css('#logout-link'));
      expect(logOutLink).toBeFalsy();
    });
  });

  describe('when user is ADMIN and is on /admin URL', () => {
    beforeEach(async () => {
      fakeAuthService.getAuthenticated = jest.fn(() => true);
      fakeUserService.isAdmin = jest.fn(() => true);
      await router.navigate(['/admin']);
      fixture.detectChanges();
    });

    it('show admin navigation', () => {
      const adminNav = fixture.debugElement.query(By.css('#admin-nav'));
      expect(adminNav).toBeTruthy();
    });
  });

  describe('when user is SUPER_USER and is on /admin URL', () => {
    beforeEach(async () => {
      fakeAuthService.getAuthenticated = jest.fn(() => true);
      fakeUserService.isSuperUser = jest.fn(() => true);
      await router.navigate(['/admin']);
      fixture.detectChanges();
    });

    it('show admin navigation', () => {
      const adminNav = fixture.debugElement.query(By.css('#admin-nav'));
      expect(adminNav).toBeTruthy();
    });
  });
});
