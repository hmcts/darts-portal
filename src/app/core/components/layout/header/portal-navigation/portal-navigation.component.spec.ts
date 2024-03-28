import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { PortalNavigationComponent } from './portal-navigation.component';

describe('PortalNavigationComponent', () => {
  let component: PortalNavigationComponent;
  let fixture: ComponentFixture<PortalNavigationComponent>;
  let fakeCountService: Partial<CountNotificationService>;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
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
      imports: [PortalNavigationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: CountNotificationService,
          useValue: fakeCountService,
        },
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should set unread audio count', () => {
    const unreadCountElement: HTMLSpanElement = fixture.debugElement.query(
      By.css('#unreadAudioCountNotifications')
    ).nativeElement;
    expect(unreadCountElement.textContent).toBe('Ready requests not viewed count: 1');
  });
});
