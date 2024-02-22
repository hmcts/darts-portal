import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MediaRequest, RequestedMedia, TransformedMedia } from '@portal-types/index';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AudiosComponent } from './audios.component';

describe('AudiosComponent', () => {
  let component: AudiosComponent;
  let fixture: ComponentFixture<AudiosComponent>;

  const MOCK_MEDIA_REQUESTS: RequestedMedia = {
    mediaRequests: [
      {
        caseId: 1,
        mediaRequestId: 1,
        caseNumber: 'C1',
        courthouseName: 'Swansea',
        hearingDate: DateTime.fromISO('2022-01-03'),
        startTime: DateTime.fromISO('2023-08-21T09:00:00Z'),
        endTime: DateTime.fromISO('2023-08-21T10:00:00Z'),
        status: 'OPEN',
        requestType: 'PLAYBACK',
        hearingId: 1,
      },
      {
        caseId: 2,
        mediaRequestId: 2,
        caseNumber: 'C2',
        courthouseName: 'Swansea',
        hearingDate: DateTime.fromISO('2022-01-03'),
        startTime: DateTime.fromISO('2023-08-21T09:00:00Z'),
        endTime: DateTime.fromISO('2023-08-21T10:00:00Z'),
        status: 'FAILED',
        requestType: 'PLAYBACK',
        hearingId: 2,
      },
    ],
    transformedMedia: [
      {
        caseId: 3,
        mediaRequestId: 3,
        caseNumber: 'C3',
        courthouseName: 'Cardiff',
        hearingDate: DateTime.fromISO('2022-01-04'),
        startTime: DateTime.fromISO('2022-01-04T09:00:00Z'),
        endTime: DateTime.fromISO('2022-01-04T10:00:00Z'),
        transformedMediaExpiryTs: DateTime.fromISO('2022-01-04T09:00:00Z'),
        status: 'COMPLETED',
        requestType: 'PLAYBACK',
        lastAccessedTs: undefined,
        transformedMediaFilename: 'C3.mp3',
        transformedMediaFormat: 'MP3',
        transformedMediaId: 3,
        hearingId: 3,
      },
    ],
  };

  const MOCK_EXPIRED_MEDIA_REQUESTS: RequestedMedia = {
    mediaRequests: [],
    transformedMedia: [
      {
        caseId: 4,
        mediaRequestId: 4,
        caseNumber: 'C4',
        courthouseName: 'Cardiff',
        hearingDate: DateTime.fromISO('2022-01-04'),
        startTime: DateTime.fromISO('2022-01-04T09:00:00Z'),
        endTime: DateTime.fromISO('2022-01-04T10:00:00Z'),
        transformedMediaExpiryTs: DateTime.fromISO('2022-01-04T09:00:00Z'),
        status: 'COMPLETED',
        requestType: 'PLAYBACK',
        lastAccessedTs: DateTime.fromISO('2022-01-04T09:00:00Z'),
        transformedMediaFilename: 'C4.mp3',
        transformedMediaFormat: 'MP3',
        transformedMediaId: 4,
        hearingId: 4,
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
    deleteTransformedMedia: jest.fn(),
    setAudioRequest: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiosComponent, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AudioRequestService, useValue: audioServiceStub },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onSelectedAudio', () => {
    it('should set selectedAudioRequests array', () => {
      const selectedAudioRequests = [{} as TransformedMedia];

      component.onSelectedAudio(selectedAudioRequests);

      expect(component.selectedAudioRequests.length).toBe(1);
    });
  });

  describe('#onDeleteClicked', () => {
    it('should set isDeleting to true if audio requests are selected', () => {
      component.selectedAudioRequests = [{} as TransformedMedia];

      component.onDeleteClicked();

      expect(component.isDeleting).toBeTruthy();
    });

    it('should not set isDeleting to true if audio requests are not selected', () => {
      component.onDeleteClicked();

      expect(component.isDeleting).toBeFalsy();
    });
  });

  describe('#onDeleteConfirmed', () => {
    it('should set isDeleting to true if transformed media is selected and isAudioRequest is false', () => {
      const deleteSpy = jest.spyOn(audioServiceStub, 'deleteTransformedMedia');
      component.isAudioRequest = false;

      component.selectedAudioRequests = [
        { transformedMediaId: 1 } as TransformedMedia,
        { transformedMediaId: 2 } as TransformedMedia,
        { transformedMediaId: 3 } as TransformedMedia,
      ];

      component.onDeleteConfirmed();

      expect(deleteSpy).toBeCalledTimes(3);
      expect(deleteSpy).toHaveBeenCalledWith(1);
      expect(deleteSpy).toHaveBeenCalledWith(2);
      expect(deleteSpy).toHaveBeenCalledWith(3);
    });

    it('should set isDeleting to true if audio requests are selected and isAudioRequest is true', () => {
      const deleteSpy = jest.spyOn(audioServiceStub, 'deleteAudioRequests');
      component.isAudioRequest = true;

      component.selectedAudioRequests = [
        { mediaRequestId: 1 } as TransformedMedia,
        { mediaRequestId: 2 } as TransformedMedia,
        { mediaRequestId: 3 } as TransformedMedia,
      ];

      component.onDeleteConfirmed();

      expect(deleteSpy).toHaveBeenCalledTimes(3);
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
      component.selectedAudioRequests = [{} as TransformedMedia];

      component.onTabChanged();

      expect(component.selectedAudioRequests.length).toBe(0);
    });
  });

  describe('#onClearClicked', () => {
    it('should set selectedAudioRequests to contain the clicked row', () => {
      const event = new MouseEvent('click');
      const row: MediaRequest = { mediaRequestId: 1 } as MediaRequest;

      component.onClearClicked(event, row);

      expect(component.selectedAudioRequests).toEqual([row]);
    });

    it('should set isDeleting to true', () => {
      const event = new MouseEvent('click');
      const row: MediaRequest = { mediaRequestId: 1 } as MediaRequest;

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
      const transformedMedia: TransformedMedia = { mediaRequestId: 1 } as TransformedMedia;

      const navigateSpy = jest.spyOn(component.router, 'navigate');

      component.onViewTransformedMedia(event, transformedMedia);

      expect(navigateSpy).toHaveBeenCalledWith(['./audios', transformedMedia.mediaRequestId], {
        state: { transformedMedia },
      });
    });
  });

  describe('#getStatusClass', () => {
    it('should return "govuk-tag--yellow" for status "OPEN"', () => {
      const status = 'OPEN';
      const result = component.getStatusClass(status);
      expect(result).toBe('govuk-tag--yellow');
    });

    it('should return "govuk-tag--yellow" for status "PROCESSING"', () => {
      const status = 'PROCESSING';
      const result = component.getStatusClass(status);
      expect(result).toBe('govuk-tag--yellow');
    });

    it('should return "govuk-tag--yellow" for status "OPEN"', () => {
      const status = 'PROCESSING';
      const result = component.getStatusClass(status);
      expect(result).toBe('govuk-tag--yellow');
    });

    it('should return "govuk-tag--red" for status "FAILED"', () => {
      const status = 'FAILED';
      const result = component.getStatusClass(status);
      expect(result).toBe('govuk-tag--red');
    });

    it('should return "govuk-tag--green" for status "COMPLETED"', () => {
      const status = 'COMPLETED';
      const result = component.getStatusClass(status);
      expect(result).toBe('govuk-tag--green');
    });

    it('should return "govuk-tag--grey" for status "EXPIRED"', () => {
      const status = 'EXPIRED';
      const result = component.getStatusClass(status);
      expect(result).toBe('govuk-tag--grey');
    });

    it('should return "govuk-tag--blue" for unknown status', () => {
      const status = 'UNKNOWN';
      const result = component.getStatusClass(status);
      expect(result).toBe('govuk-tag--blue');
    });
  });

  describe('#getStatusText', () => {
    it('should return "READY" when status is "COMPLETED"', () => {
      const status = 'COMPLETED';
      const result = component.getStatusText(status);
      expect(result).toBe('READY');
    });

    it('should return "IN PROGRESS" when status is "PROCESSING"', () => {
      const status = 'PROCESSING';
      const result = component.getStatusText(status);
      expect(result).toBe('IN PROGRESS');
    });

    it('should return "REQUESTED" when status is "OPEN"', () => {
      const status = 'OPEN';
      const result = component.getStatusText(status);
      expect(result).toBe('REQUESTED');
    });

    it('should return the same status when status is not "COMPLETED" or "PROCESSING"', () => {
      const status = 'UNKNOWN';
      const result = component.getStatusText(status);
      expect(result).toBe(status);
    });
  });
});
