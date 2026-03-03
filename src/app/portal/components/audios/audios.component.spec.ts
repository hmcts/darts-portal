import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MediaRequest, RequestedMedia, TransformedMedia } from '@portal-types/index';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { DateTime } from 'luxon';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AudiosComponent } from './audios.component';
import { fakeAsync, flush } from '@angular/core/testing';

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
    downloadAudio: jest.fn().mockReturnValue(of(new Blob())),
    patchAudioRequestLastAccess: jest.fn().mockReturnValue(of(void 0)),
  };

  const downloadService = {
    saveAs: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiosComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AudioRequestService, useValue: audioServiceStub },
        { provide: FileDownloadService, useValue: downloadService },
        DatePipe,
        provideRouter([]),
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

      expect(component.isDeleting()).toBeFalsy();
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

      expect(component.isDeleting()).toBeFalsy();
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

      expect(component.isDeleting()).toBe(true);
    });
  });

  describe('#onDeleteCancelled', () => {
    it('should set isDeleting to false', () => {
      component.isDeleting.set(true);

      component.onDeleteCancelled();

      expect(component.isDeleting()).toBeFalsy();
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
  describe('#onDownloadConfirmed patch and refresh', () => {
    it('patches lastAccess for downloaded audio then triggers a refresh', fakeAsync(() => {
      component.selectedAudioRequests = [
        { transformedMediaId: 1, transformedMediaFilename: 'a1.mp3', requestType: 'DOWNLOAD' } as TransformedMedia,
        { transformedMediaId: 2, transformedMediaFilename: 'a2.mp3', requestType: 'DOWNLOAD' } as TransformedMedia,
      ];

      const downloadSpy = jest.spyOn(audioServiceStub, 'downloadAudio');
      const patchSpy = jest.spyOn(audioServiceStub, 'patchAudioRequestLastAccess');
      // access private refresh$ with a typed cast
      const refresh$ = (component as unknown as { refresh$: BehaviorSubject<void> }).refresh$;
      const refreshNextSpy = jest.spyOn(refresh$, 'next');

      component.onDownloadConfirmed();
      // Flush so forkJoins finish
      flush();

      expect(downloadSpy).toHaveBeenCalledTimes(2);
      expect(downloadSpy).toHaveBeenNthCalledWith(1, 1, 'DOWNLOAD');
      expect(downloadSpy).toHaveBeenNthCalledWith(2, 2, 'DOWNLOAD');

      expect(patchSpy).toHaveBeenCalledTimes(2);
      expect(patchSpy).toHaveBeenCalledWith(1);
      expect(patchSpy).toHaveBeenCalledWith(2);

      expect(refreshNextSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('#onDownloadConfirmed', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not download if errors exist', () => {
      component.selectedAudioRequests = [];

      const downloadAudioSpy = jest.spyOn(audioServiceStub, 'downloadAudio');
      const saveAsSpy = jest.spyOn(downloadService, 'saveAs');

      component.onDownloadConfirmed();

      expect(downloadAudioSpy).not.toHaveBeenCalled();
      expect(saveAsSpy).not.toHaveBeenCalled();
    });

    it('should download all selected audio files when no errors exist', () => {
      component.selectedAudioRequests = [
        {
          transformedMediaId: 1,
          transformedMediaFilename: 'audio1.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 2,
          transformedMediaFilename: 'audio2.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
      ];

      const downloadAudioSpy = jest.spyOn(audioServiceStub, 'downloadAudio');

      component.onDownloadConfirmed();

      expect(downloadAudioSpy).toHaveBeenCalledTimes(2);
      expect(downloadAudioSpy).toHaveBeenCalledWith(1, 'DOWNLOAD');
      expect(downloadAudioSpy).toHaveBeenCalledWith(2, 'DOWNLOAD');
    });

    it('should set errors if there are issues during download', () => {
      component.selectedAudioRequests = [
        {
          transformedMediaId: 1,
          transformedMediaFilename: 'audio1.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 2,
          transformedMediaFilename: 'audio2.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
      ];

      const errorSpy = jest.spyOn(component.errors, 'set');
      const errorResponse = new HttpErrorResponse({ error: { type: 'some-error' } });

      const downloadAudioSpy = jest.spyOn(audioServiceStub, 'downloadAudio');
      downloadAudioSpy.mockReturnValue(throwError(() => errorResponse)); // Simulate an error for the second download

      component.onDownloadConfirmed();

      expect(errorSpy).toHaveBeenCalledWith([
        { fieldId: 'bulkDownload', message: 'There has been an error downloading audio' },
      ]);
    });

    it('should set errors if there are more than 20 selected files for download', () => {
      component.selectedAudioRequests = [
        {
          transformedMediaId: 1,
          transformedMediaFilename: 'audio1.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 2,
          transformedMediaFilename: 'audio2.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 3,
          transformedMediaFilename: 'audio3.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 4,
          transformedMediaFilename: 'audio4.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 5,
          transformedMediaFilename: 'audio5.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 6,
          transformedMediaFilename: 'audio6.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 7,
          transformedMediaFilename: 'audio7.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 8,
          transformedMediaFilename: 'audio8.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 9,
          transformedMediaFilename: 'audio9.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 10,
          transformedMediaFilename: 'audio10.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 11,
          transformedMediaFilename: 'audio11.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 12,
          transformedMediaFilename: 'audio12.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 13,
          transformedMediaFilename: 'audio13.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 14,
          transformedMediaFilename: 'audio14.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 15,
          transformedMediaFilename: 'audio15.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 16,
          transformedMediaFilename: 'audio16.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 17,
          transformedMediaFilename: 'audio17.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 18,
          transformedMediaFilename: 'audio18.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 19,
          transformedMediaFilename: 'audio19.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 20,
          transformedMediaFilename: 'audio20.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
        {
          transformedMediaId: 21,
          transformedMediaFilename: 'audio21.mp3',
          requestType: 'DOWNLOAD',
        } as TransformedMedia,
      ];

      const errorSpy = jest.spyOn(component.errors, 'set');
      // const errorResponse = new HttpErrorResponse({ error: { type: 'some-error' } });

      const downloadAudioSpy = jest.spyOn(audioServiceStub, 'downloadAudio');
      component.onDownloadConfirmed();

      expect(downloadAudioSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith([
        {
          fieldId: 'bulkDownload',
          message: 'There is a maximum of 20 files that can be selected for bulk download in one go',
        },
      ]);
    });
  });

  describe('#getStatusColour', () => {
    it('should return "yellow" for status "OPEN"', () => {
      const status = 'OPEN';
      const result = component.getStatusColour(status);
      expect(result).toBe('yellow');
    });

    it('should return "yellow" for status "PROCESSING"', () => {
      const status = 'PROCESSING';
      const result = component.getStatusColour(status);
      expect(result).toBe('yellow');
    });

    it('should return "yellow" for status "OPEN"', () => {
      const status = 'PROCESSING';
      const result = component.getStatusColour(status);
      expect(result).toBe('yellow');
    });

    it('should return "red" for status "FAILED"', () => {
      const status = 'FAILED';
      const result = component.getStatusColour(status);
      expect(result).toBe('red');
    });

    it('should return "green" for status "COMPLETED"', () => {
      const status = 'COMPLETED';
      const result = component.getStatusColour(status);
      expect(result).toBe('green');
    });

    it('should return "grey" for status "EXPIRED"', () => {
      const status = 'EXPIRED';
      const result = component.getStatusColour(status);
      expect(result).toBe('grey');
    });

    it('should return "blue" for unknown status', () => {
      const status = 'UNKNOWN';
      const result = component.getStatusColour(status);
      expect(result).toBe('blue');
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
