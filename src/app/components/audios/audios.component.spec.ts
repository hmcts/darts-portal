import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAudioRequestRow } from '@darts-types/user-audio-request-row.interface';
import { MediaRequests } from '@darts-types/user-audio-request.interface';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { of } from 'rxjs';

import { AudiosComponent } from './audios.component';

describe('AudiosComponent', () => {
  let component: AudiosComponent;
  let fixture: ComponentFixture<AudiosComponent>;

  const MOCK_MEDIA_REQUESTS: MediaRequests = {
    media_request_details: [
      {
        case_id: 1,
        media_request_id: 1,
        case_number: 'C1',
        courthouse_name: 'Swansea',
        hearing_date: '2022-01-03',
        start_ts: '2023-08-21T09:00:00Z',
        end_ts: '2023-08-21T10:00:00Z',
        transformed_media_expiry_ts: '2023-08-23T09:00:00Z',
        media_request_status: 'OPEN',
        request_type: 'PLAYBACK',
        last_accessed_ts: '2023-08-23T09:00:00Z',
        transformed_media_filename: 'C1',
        transformed_media_format: 'MP3',
        transformed_media_id: 1,
        hearing_id: 1,
      },
      {
        case_id: 2,
        media_request_id: 2,
        case_number: 'C2',
        courthouse_name: 'Swansea',
        hearing_date: '2022-01-03',
        start_ts: '2023-08-21T09:00:00Z',
        end_ts: '2023-08-21T10:00:00Z',
        transformed_media_expiry_ts: '2023-08-23T09:00:00Z',
        media_request_status: 'FAILED',
        request_type: 'PLAYBACK',
        last_accessed_ts: '2023-08-23T09:00:00Z',
        transformed_media_filename: 'C2',
        transformed_media_format: 'MP3',
        transformed_media_id: 2,
        hearing_id: 2,
      },
    ],
    transformed_media_details: [
      {
        case_id: 3,
        media_request_id: 3,
        case_number: 'C3',
        courthouse_name: 'Cardiff',
        hearing_date: '2022-01-04',
        start_ts: '2022-01-04T09:00:00Z',
        end_ts: '2022-01-04T10:00:00Z',
        transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
        media_request_status: 'COMPLETED',
        request_type: 'PLAYBACK',
        last_accessed_ts: '',
        transformed_media_filename: 'C3',
        transformed_media_format: 'MP3',
        transformed_media_id: 3,
        hearing_id: 3,
      },
    ],
  };

  const MOCK_EXPIRED_MEDIA_REQUESTS: MediaRequests = {
    media_request_details: [],
    transformed_media_details: [
      {
        case_id: 4,
        media_request_id: 4,
        case_number: 'C4',
        courthouse_name: 'Cardiff',
        hearing_date: '2022-01-04',
        start_ts: '2022-01-04T09:00:00Z',
        end_ts: '2022-01-04T10:00:00Z',
        transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
        media_request_status: 'COMPLETED',
        request_type: 'PLAYBACK',
        last_accessed_ts: '2022-01-04T09:00:00Z',
        transformed_media_filename: 'C4',
        transformed_media_format: 'MP3',
        transformed_media_id: 4,
        hearing_id: 4,
      },
    ],
  };

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 },
      },
    },
  };

  const audioServiceStub = {
    audioRequests$: of(MOCK_MEDIA_REQUESTS),
    expiredAudioRequests$: of(MOCK_EXPIRED_MEDIA_REQUESTS),
    deleteAudioRequests: jest.fn(),
    setAudioRequest: jest.fn(),
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
    const audioRequests: MediaRequests = MOCK_MEDIA_REQUESTS;

    const result = component.filterInProgressRequests(audioRequests.media_request_details);

    expect(result.length).toEqual(2);
    expect(result[0].media_request_status).toEqual('OPEN');
    expect(result[1].media_request_status).toEqual('FAILED');
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

  describe('#onClearClicked', () => {
    it('should set selectedAudioRequests to contain the clicked row', () => {
      const event = new MouseEvent('click');
      const row: UserAudioRequestRow = { requestId: 1 } as UserAudioRequestRow;

      component.onClearClicked(event, row);

      expect(component.selectedAudioRequests).toEqual([row]);
    });

    it('should set isDeleting to true', () => {
      const event = new MouseEvent('click');
      const row: UserAudioRequestRow = { requestId: 1 } as UserAudioRequestRow;

      component.onClearClicked(event, row);

      expect(component.isDeleting).toBe(true);
    });
  });

  describe('#onDeleteCancelled', () => {
    it('should set isDeleting to false', () => {
      component.isDeleting = true;

      component.onDeleteCancelled();

      expect(component.isDeleting).toBeFalsy();
    });
  });

  describe('#onViewAudioRequest', () => {
    it('should store audio request in service and navigate to view screen', () => {
      const event = new MouseEvent('click');
      const audioRequestRow: UserAudioRequestRow = { requestId: 1 } as UserAudioRequestRow;

      const setAudioRequestSpy = jest.spyOn(audioServiceStub, 'setAudioRequest');
      const navigateSpy = jest.spyOn(mockRouter, 'navigate');

      component.onViewAudioRequest(event, audioRequestRow);

      expect(setAudioRequestSpy).toHaveBeenCalledWith(audioRequestRow);
      expect(navigateSpy).toHaveBeenCalledWith(['./audios', audioRequestRow.requestId]);
    });
  });
});
