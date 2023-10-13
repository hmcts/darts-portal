import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { AuthService } from '@services/auth/auth.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { combineLatest, of } from 'rxjs';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fakeAuthService: Partial<AuthService>;
  let fakeAudioService: Partial<AudioRequestService>;

  const MOCK_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
      media_request_id: 12311,
      case_number: 'T20202110',
      courthouse_name: 'Manchester Minshull Street',
      hearing_date: '2023-10-13',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
  ];

  beforeEach(async () => {
    const fakeAppInsightsService = {};
    fakeAuthService = {
      getAuthenticated: jest.fn(() => true),
    };
    fakeAudioService = {
      headerData$: combineLatest({
        audioRequest: of(MOCK_AUDIO_REQUESTS),
        unreadCount: of(5),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HeaderComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: AudioRequestService, useValue: fakeAudioService },
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
});
