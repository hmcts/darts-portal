import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { AuthService } from '@services/auth/auth.service';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserService: Partial<UserService>;
  let fakeCountService: Partial<CountNotificationService>;

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
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HeaderComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: CountNotificationService, useValue: fakeCountService },
        { provide: UserService, useValue: fakeUserService },
      ],
    }).compileComponents();

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

  describe('when user IS NOT transcriber', () => {
    it('not show "Transcript requests" link in navigation', () => {
      const transcriptRequestsLink = fixture.debugElement.query(By.css('#transcript-requests-link'));

      expect(transcriptRequestsLink).toBeFalsy();
    });

    it('not show "Your work" link in navigation', () => {
      const yourWorkLink = fixture.debugElement.query(By.css('#your-work-link'));

      expect(yourWorkLink).toBeFalsy();
    });
  });

  describe('when user IS transcriber', () => {
    beforeEach(() => {
      fakeUserService.isTranscriber = jest.fn(() => true);
      fixture.detectChanges();
    });

    it('shows "Transcript requests" link in navigation', () => {
      const transcriptRequestsLink = fixture.debugElement.query(By.css('#transcript-requests-link'));
      expect(transcriptRequestsLink).toBeTruthy();
    });

    it('shows "Your work" link in navigation', () => {
      const yourWorkLink = fixture.debugElement.query(By.css('#your-work-link'));
      expect(yourWorkLink).toBeTruthy();
    });

    it('should set "Transcript requests" count', () => {
      const unreadCountElement: HTMLSpanElement = fixture.debugElement.query(
        By.css('#unassignedTranscriptCount')
      ).nativeElement;
      expect(unreadCountElement.textContent).toBe('Transcript requests unassigned count: 2');
    });

    it('should set "Your work" count', () => {
      const unreadCountElement: HTMLSpanElement = fixture.debugElement.query(
        By.css('#assignedTranscriptCount')
      ).nativeElement;
      expect(unreadCountElement.textContent).toBe('Transcript requests assigned count: 3');
    });
  });
});
