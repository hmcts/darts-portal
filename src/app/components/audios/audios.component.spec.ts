import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { AudioService } from '@services/audio/audio.service';
import { of } from 'rxjs';

import { AudiosComponent } from './audios.component';

describe('AudiosComponent', () => {
  let component: AudiosComponent;
  let fixture: ComponentFixture<AudiosComponent>;

  const MOCK_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
      media_request_id: 1401,
      case_number: '461_Case1',
      courthouse_name: 'Leeds',
      hearing_date: '2023-08-11',
      media_request_start_ts: '2023-08-11T09:37:30Z',
      media_request_end_ts: '2023-08-11T09:37:30Z',
      media_request_status: 'OPEN',
    },
    {
      media_request_id: 1241,
      case_number: '461_Case1',
      courthouse_name: 'Leeds',
      hearing_date: '2023-08-11',
      media_request_start_ts: '2023-08-11T09:37:30Z',
      media_request_end_ts: '2023-08-11T09:37:30Z',
      media_request_status: 'PROCESSING',
    },
    {
      media_request_id: 1281,
      case_number: '461_Case1',
      courthouse_name: 'Leeds',
      hearing_date: '2023-08-11',
      media_request_start_ts: '2023-08-11T09:37:30Z',
      media_request_end_ts: '2023-08-11T09:37:30Z',
      media_request_status: 'FAILED',
    },
    {
      media_request_id: 1301,
      case_number: 'CASE1009',
      courthouse_name: 'Liverpool',
      hearing_date: '2023-08-15',
      media_request_start_ts: '2023-08-15T14:07:33Z',
      media_request_end_ts: '2023-08-15T14:07:33Z',
      media_request_status: 'COMPLETED',
    },
  ];

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 },
      },
    },
  };

  const audioServiceStub = {
    getAudioRequestsForUser: jest.fn(() => of(MOCK_AUDIO_REQUESTS)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiosComponent],
      providers: [
        DatePipe,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AudioService, useValue: audioServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter in-progress audio requests correctly', () => {
    const audioRequests: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;

    const result = component.filterInProgressRequests(audioRequests);

    expect(result.length).toEqual(3);
    expect(result[0].media_request_status).toEqual('OPEN');
    expect(result[1].media_request_status).toEqual('PROCESSING');
    expect(result[2].media_request_status).toEqual('FAILED');
  });

  it('should filter completed audio requests correctly', () => {
    const audioRequests: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;

    const result = component.filterCompletedRequests(audioRequests);

    expect(result.length).toEqual(1);
    expect(result[0].media_request_status).toEqual('COMPLETED');
  });
});
