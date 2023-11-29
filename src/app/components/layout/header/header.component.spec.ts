import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fakeAuthService: Partial<AuthService>;
  let fakeAudioService: Partial<AudioRequestService>;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const fakeAppInsightsService = {};
    fakeAuthService = {
      getAuthenticated: jest.fn(() => true),
    };
    fakeAudioService = { unreadAudioCount$: of(5) };
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
        { provide: AudioRequestService, useValue: fakeAudioService },
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

  it('should set header count', () => {
    const unreadCountElement: HTMLSpanElement = fixture.debugElement.query(By.css('#notifications')).nativeElement;
    expect(unreadCountElement.textContent).toBe('Ready requests not viewed count: 5');
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
  });
});
