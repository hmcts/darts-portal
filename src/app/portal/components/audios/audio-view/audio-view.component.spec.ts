import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AudioPlayerComponent } from '@components/common/audio-player/audio-player.component';
import { PlayButtonComponent } from '@components/common/play-button/play-button.component';
import { HearingEvent } from '@portal-types/hearing/hearing-event.interface';
import { Case, HearingEventRow, TransformedMedia } from '@portal-types/index';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HearingService } from '@services/hearing/hearing.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AudioViewComponent } from './audio-view.component';

describe('AudioViewComponent', () => {
  let component: AudioViewComponent;
  let fixture: ComponentFixture<AudioViewComponent>;
  let patchAudioRequestLastAccessSpy: jest.SpyInstance;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        requestId: 12378,
      },
    },
  };

  const appConfigServiceMock = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    }),
  };

  const MOCK_HEARING_EVENTS: HearingEvent[] = [
    {
      id: -1,
      timestamp: '2023-11-13T08:59:00.000Z',
      name: 'Case called on',
      text: 'Record: New Case',
    },
    {
      id: 0,
      timestamp: '2023-11-13T09:00:00.000Z',
      name: 'Case called on',
      text: 'Record: New Case',
    },
    {
      id: 1,
      timestamp: '2023-11-13T09:00:10.000Z',
      name: 'Case called on',
      text: 'Record: New Case',
    },
    {
      id: 2,
      timestamp: '2023-11-13T09:00:20.000Z',
      name: 'Case called on',
      text: 'Record: New Case',
    },
    {
      id: 3,
      timestamp: '2023-11-13T09:00:30.000Z',
      name: 'Case called on',
      text: 'Record: New Case',
    },
    {
      id: 4,
      timestamp: '2023-11-13T09:00:50.000Z',
      name: 'Case called on',
      text: 'Record: New Case',
    },
    {
      id: 5,
      timestamp: '2023-11-13T09:01:50.000Z',
      name: 'Case called on',
      text: 'Record: New Case',
    },
  ];

  const MOCK_CASE: Case = {
    id: 1,
    number: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reportingRestrictions: [
      {
        hearing_id: 1,
        event_id: 1,
        event_name: 'Section 4(2) of the Contempt of Court Act 1981',
        event_text: '',
        event_ts: '2023-08-10T09:00:00Z',
      },
    ],
  };

  const MOCK_AUDIO_REQUEST: TransformedMedia = {
    caseId: 6,
    caseNumber: 'T20200331',
    courthouseName: 'Swindon',
    hearingDate: DateTime.fromISO('2023-11-13'),
    startTime: DateTime.fromISO('2023-11-13T09:00:00Z'),
    endTime: DateTime.fromISO('2023-11-13T09:01:00Z'),
    mediaRequestId: 12378,
    transformedMediaExpiryTs: DateTime.fromISO('2023-08-23T09:00:00Z'),
    status: 'COMPLETED',
    hearingId: 3,
    requestType: 'PLAYBACK',
    lastAccessedTs: undefined,
    transformedMediaFilename: 'T20200331.mp3',
    transformedMediaFormat: 'mp3',
    transformedMediaId: 1,
  };

  const fakeHearingService = {
    getEvents: () => of(MOCK_HEARING_EVENTS),
  };

  const fakeErrorMessageService = {
    errorMessage$: of(null),
    clearErrorMessage: jest.fn(),
  };

  const fakeAudioRequestService = {
    patchAudioRequestLastAccess: () => of(new HttpResponse<Response>({ status: 200 })),
    deleteTransformedMedia: jest.fn(),
    downloadAudio: jest.fn(),
    isAudioPlaybackAvailable: jest.fn(),
  };

  const fakeCaseService = {
    getCase: () => of(MOCK_CASE),
  };

  const mockNavigationExtras = {
    extras: {
      state: {
        transformedMedia: MOCK_AUDIO_REQUEST,
      },
    },
  };

  describe('With transformedMedia', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          AudioViewComponent,
          PlayButtonComponent,
          AudioPlayerComponent,
          HttpClientTestingModule,
          RouterTestingModule,
        ],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AudioRequestService, useValue: fakeAudioRequestService },
          { provide: HearingService, useValue: fakeHearingService },
          { provide: CaseService, useValue: fakeCaseService },
          { provide: ErrorMessageService, useValue: fakeErrorMessageService },
          { provide: AppConfigService, useValue: appConfigServiceMock },
          DatePipe,
          { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
        ],
      });

      router = TestBed.inject(Router);
      jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNavigationExtras as unknown as Navigation);

      fixture = TestBed.createComponent(AudioViewComponent);
      component = fixture.componentInstance;
      patchAudioRequestLastAccessSpy = jest.spyOn(fakeAudioRequestService, 'patchAudioRequestLastAccess');
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('#constructor', () => {
      it('should set the audioRequest', () => {
        expect(component.transformedMedia).toEqual(MOCK_AUDIO_REQUEST);
      });
      it('should set the requestId', () => {
        expect(component.requestId).toEqual(MOCK_AUDIO_REQUEST.mediaRequestId);
      });
      it('should set the case$', () => {
        expect(component.case$).toBeTruthy();
      });
      it('should set the hearingEvents$', () => {
        expect(component.eventRows$).toBeTruthy();
      });
      it('should set the currentPlayTime', () => {
        expect(component.currentPlayTime).toEqual(0);
      });
      it('should call patchAudioRequestLastAccess()', () => {
        expect(patchAudioRequestLastAccessSpy).toHaveBeenCalledWith(1, true);
      });
    });

    describe('#isRowPlaying', () => {
      it('should return true if the row is playing', () => {
        component.currentPlayTime = 1.5;
        const row: HearingEventRow = {
          eventType: 'Case called on',
          eventTime: '2023-11-13T09:00:10.000Z',
          audioTime: '00:00:10',
          startTime: 1,
          endTime: 2,
        };
        expect(component.isRowPlaying(row)).toBe(true);
      });

      it('should return false if the row is not playing', () => {
        component.currentPlayTime = 1.5;
        const row: HearingEventRow = {
          eventType: 'Case called on',
          eventTime: '2023-11-13T09:00:10.000Z',
          audioTime: '00:00:10',
          startTime: 2,
          endTime: 3,
        };
        expect(component.isRowPlaying(row)).toBe(false);
      });
    });

    it('should navigate to /audios on successful deletion', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      fakeAudioRequestService.deleteTransformedMedia.mockReturnValue(of(null));
      component.transformedMedia.transformedMediaId = 123;

      component.onDeleteConfirmed();

      expect(fakeAudioRequestService.deleteTransformedMedia).toHaveBeenCalledWith(123);

      expect(routerSpy).toHaveBeenCalledWith(['/audios']);
    });

    it('should set isDeleting to false on deletion error', () => {
      const error = new HttpErrorResponse({ status: 500 });
      fakeAudioRequestService.deleteTransformedMedia.mockReturnValue(of(error));
      component.transformedMedia.transformedMediaId = 123;

      component.onDeleteConfirmed();

      expect(fakeAudioRequestService.deleteTransformedMedia).toHaveBeenCalledWith(123);
      expect(component.isDeleting).toBe(false);
    });

    it('should download audio and call saveAs', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/mpeg' });
      component.transformedMedia.transformedMediaId = 12378;

      fakeAudioRequestService.downloadAudio.mockReturnValue(of(mockBlob));

      const saveAsSpy = jest.spyOn(component.downloadService, 'saveAs');

      component.onDownloadClicked();

      expect(fakeAudioRequestService.downloadAudio).toHaveBeenCalledWith(12378, 'PLAYBACK');

      expect(saveAsSpy).toHaveBeenCalledWith(mockBlob, 'T20200331.mp3');
    });
  });

  describe('With audioRequestView set to null', () => {
    const audioRequestService = {
      patchAudioRequestLastAccess: () => of(new HttpResponse<Response>({ status: 200 })),
      deleteTransformedMedia: jest.fn(),
      downloadAudio: jest.fn(),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AudioViewComponent, HttpClientTestingModule, RouterTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AudioRequestService, useValue: audioRequestService },
          { provide: AppConfigService, useValue: appConfigServiceMock },
        ],
      });
      router = TestBed.inject(Router);
      jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({} as unknown as Navigation);
      routerSpy = jest.spyOn(router, 'navigate');
      fixture = TestBed.createComponent(AudioViewComponent);
      component = fixture.componentInstance;
    });

    it('should navigate to /audios on undefined transformedMedia', () => {
      fixture.detectChanges();
      expect(routerSpy).toHaveBeenCalledWith(['/audios']);
    });
  });
});
