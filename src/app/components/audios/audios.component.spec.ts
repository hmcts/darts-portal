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
      media_request_id: 12345,
      case_number: 'T20200190',
      courthouse_name: 'Manchester Minshull Street',
      hearing_date: '2023-10-03',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'OPEN',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      media_request_id: 12346,
      case_number: 'T2020019210',
      courthouse_name: 'Reading',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'PROCESSING',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      media_request_id: 12347,
      case_number: 'T20200192222',
      courthouse_name: 'Slough',
      hearing_date: '2023-11-12',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'OPEN',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      media_request_id: 12347,
      case_number: 'T20200192231',
      courthouse_name: 'Brighton',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'FAILED',
    },
    {
      media_request_id: 12378,
      case_number: 'T20200331',
      courthouse_name: 'Liverpool',
      hearing_date: '2023-10-04',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      media_request_id: 12377,
      case_number: 'T20200333',
      courthouse_name: 'Liverpool',
      hearing_date: '2023-10-04',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      media_request_id: 12342,
      case_number: 'T2020011820',
      courthouse_name: 'Ascot',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      media_request_id: 12341,
      case_number: 'T2023453422',
      courthouse_name: 'Bournemouth',
      hearing_date: '2023-11-15',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      media_request_id: 123443,
      case_number: 'T20200192231',
      courthouse_name: 'Brighton',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      media_request_id: 123449,
      case_number: 'T202001922310202',
      courthouse_name: 'Swindon',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
  ];

  const MOCK_EXPIRED_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
      media_request_id: 12311,
      case_number: 'T20202110',
      courthouse_name: 'Manchester Minshull Street',
      hearing_date: '2023-10-13',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'EXPIRED',
    },
    {
      media_request_id: 123123,
      case_number: 'T202001232',
      courthouse_name: 'Reading',
      hearing_date: '2023-11-21',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'EXPIRED',
    },
    {
      media_request_id: 4321,
      case_number: 'T20200192772',
      courthouse_name: 'Slough',
      hearing_date: '2023-11-28',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'EXPIRED',
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
    audioRequests$: of(MOCK_AUDIO_REQUESTS),
    expiredAudioRequests$: of(MOCK_EXPIRED_AUDIO_REQUESTS),
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

    expect(result.length).toEqual(4);
    expect(result[0].media_request_status).toEqual('OPEN');
    expect(result[1].media_request_status).toEqual('PROCESSING');
    expect(result[2].media_request_status).toEqual('OPEN');
    expect(result[3].media_request_status).toEqual('FAILED');
  });
});
