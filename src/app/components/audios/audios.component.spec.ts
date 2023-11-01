import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAudioRequestRow } from '@darts-types/user-audio-request-row.interface';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { of } from 'rxjs';

import { AudiosComponent } from './audios.component';

describe('AudiosComponent', () => {
  let component: AudiosComponent;
  let fixture: ComponentFixture<AudiosComponent>;

  const MOCK_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
      case_id: 2,
      media_request_id: 12345,
      case_number: 'T20200190',
      courthouse_name: 'Manchester Minshull Street',
      hearing_date: '2023-10-03',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'OPEN',
      last_accessed_ts: '2023-08-23T09:00:00Z',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 3,
      media_request_id: 12346,
      case_number: 'T2020019210',
      courthouse_name: 'Reading',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'PROCESSING',
      last_accessed_ts: '2023-08-23T09:00:00Z',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 4,
      media_request_id: 12347,
      case_number: 'T20200192222',
      courthouse_name: 'Slough',
      hearing_date: '2023-11-12',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'OPEN',
      last_accessed_ts: '2023-08-23T09:00:00Z',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 5,
      media_request_id: 12347,
      case_number: 'T20200192231',
      courthouse_name: 'Brighton',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'FAILED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 6,
      media_request_id: 12378,
      case_number: 'T20200331',
      courthouse_name: 'Liverpool',
      hearing_date: '2023-10-04',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 7,
      media_request_id: 12377,
      case_number: 'T20200333',
      courthouse_name: 'Liverpool',
      hearing_date: '2023-10-04',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      last_accessed_ts: '2023-08-23T09:00:00Z',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 8,
      media_request_id: 12342,
      case_number: 'T2020011820',
      courthouse_name: 'Ascot',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 9,
      media_request_id: 12341,
      case_number: 'T2023453422',
      courthouse_name: 'Bournemouth',
      hearing_date: '2023-11-15',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 10,
      media_request_id: 123443,
      case_number: 'T20200192231',
      courthouse_name: 'Brighton',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 11,
      media_request_id: 123449,
      case_number: 'T202001922310202',
      courthouse_name: 'Swindon',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
  ];

  const MOCK_EXPIRED_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
      case_id: 12,
      media_request_id: 12311,
      case_number: 'T20202110',
      courthouse_name: 'Manchester Minshull Street',
      hearing_date: '2023-10-13',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'EXPIRED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 13,
      media_request_id: 123123,
      case_number: 'T202001232',
      courthouse_name: 'Reading',
      hearing_date: '2023-11-21',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'EXPIRED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
    },
    {
      case_id: 14,
      media_request_id: 4321,
      case_number: 'T20200192772',
      courthouse_name: 'Slough',
      hearing_date: '2023-11-28',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'EXPIRED',
      request_type: 'DOWNLOAD',
      hearing_id: 123,
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
    deleteAudioRequests: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiosComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AudioRequestService, useValue: audioServiceStub },
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

  describe('#onSelectedAudio', () => {
    it('should set selectedAudioRequests array', () => {
      const selectedAudioRequests = [{} as UserAudioRequestRow];

      component.onSelectedAudio(selectedAudioRequests);

      expect(component.selectedAudioRequests.length).toBe(1);
    });
  });

  describe('#onDeleteClicked', () => {
    it('should set isDeleting to true if audio requests are selected', () => {
      component.selectedAudioRequests = [{} as UserAudioRequestRow];

      component.onDeleteClicked();

      expect(component.isDeleting).toBeTruthy();
    });

    it('should not set isDeleting to true if audio requests are not selected', () => {
      component.onDeleteClicked();

      expect(component.isDeleting).toBeFalsy();
    });
  });

  describe('#onDeleteConfirmed', () => {
    it('should set isDeleting to true if audio requests are selected', () => {
      const deleteSpy = jest.spyOn(audioServiceStub, 'deleteAudioRequests');

      component.selectedAudioRequests = [
        { requestId: 1 } as UserAudioRequestRow,
        { requestId: 2 } as UserAudioRequestRow,
        { requestId: 3 } as UserAudioRequestRow,
      ];

      component.onDeleteConfirmed();

      expect(deleteSpy).toBeCalledTimes(3);
      expect(deleteSpy).toHaveBeenCalledWith(1);
      expect(deleteSpy).toHaveBeenCalledWith(2);
      expect(deleteSpy).toHaveBeenCalledWith(3);
    });

    it('should not set isDeleting to true if audio requests are not selected', () => {
      component.onDeleteClicked();

      expect(component.isDeleting).toBeFalsy();
    });
  });

  describe('#onTabChanged', () => {
    it('should set selectedAudioRequests to empty []', () => {
      component.selectedAudioRequests = [{} as UserAudioRequestRow];

      component.onTabChanged();

      expect(component.selectedAudioRequests.length).toBe(0);
    });
  });
});
