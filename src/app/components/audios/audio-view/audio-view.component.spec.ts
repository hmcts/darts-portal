import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { PlayButtonComponent } from '@common/play-button/play-button.component';
import { HearingEvent } from '@darts-types/hearing-event.interface';
import { Case, HearingEventRow, TransformedMediaRow } from '@darts-types/index';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HearingService } from '@services/hearing/hearing.service';
import { of } from 'rxjs';
import { AudioViewComponent } from './audio-view.component';

describe('AudioViewComponent', () => {
  let component: AudioViewComponent;
  let fixture: ComponentFixture<AudioViewComponent>;
  let patchAudioRequestLastAccessSpy: jest.SpyInstance;
  let router: Router;

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
    case_id: 1,
    case_number: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 1,
        date: '2023-08-10',
        courtroom: '1',
        judges: ['Judge Judy'],
        transcript_count: 0,
      },
    ],
  };

  const MOCK_AUDIO_REQUEST: TransformedMediaRow = {
    caseId: 6,
    caseNumber: 'T20200331',
    courthouse: 'Swindon',
    hearingDate: '2023-11-13',
    startTime: '2023-11-13T09:00:00Z',
    endTime: '2023-11-13T09:01:00Z',
    requestId: 12378,
    expiry: '2023-08-23T09:00:00Z',
    status: 'COMPLETED',
    hearingId: 3,
    requestType: 'PLAYBACK',
    lastAccessed: undefined,
    filename: 'T20200331',
    format: 'mp3',
    mediaId: 1,
  };

  const fakeHearingService = {
    getEvents: () => of(MOCK_HEARING_EVENTS),
  };

  const fakeErrorMessageService = {
    errorMessage$: of(null),
    clearErrorMessage: jest.fn(),
  };

  const fakeAudioRequestService = {
    audioRequestView: MOCK_AUDIO_REQUEST,
    patchAudioRequestLastAccess: () => of(new HttpResponse<Response>({ status: 200 })),
    deleteAudioRequests: jest.fn(),
    downloadAudio: jest.fn(),
  };

  const fakeCaseService = {
    getCase: () => of(MOCK_CASE),
  };

  describe('With audioRequestView', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AudioViewComponent, PlayButtonComponent, AudioPlayerComponent, HttpClientTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AudioRequestService, useValue: fakeAudioRequestService },
          { provide: HearingService, useValue: fakeHearingService },
          { provide: CaseService, useValue: fakeCaseService },
          { provide: ErrorMessageService, useValue: fakeErrorMessageService },
          { provide: AppConfigService, useValue: appConfigServiceMock },
        ],
      });
      fixture = TestBed.createComponent(AudioViewComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router) as jest.Mocked<Router>;
      patchAudioRequestLastAccessSpy = jest.spyOn(fakeAudioRequestService, 'patchAudioRequestLastAccess');
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      // expect(component.audioPlayer).toBeTruthy();
    });

    describe('#constructor', () => {
      it('should set the audioRequest', () => {
        expect(component.transformedMedia).toEqual(fakeAudioRequestService.audioRequestView);
      });
      it('should set the requestId', () => {
        expect(component.requestId).toEqual(fakeAudioRequestService.audioRequestView.requestId);
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
      it('should set the fileName', () => {
        expect(component.fileName).toEqual('T20200331.mp3');
      });
      it('should call patchAudioRequestLastAccess()', () => {
        expect(patchAudioRequestLastAccessSpy).toHaveBeenCalledWith(12378, true);
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
      fakeAudioRequestService.deleteAudioRequests.mockReturnValue(of(null));
      component.requestId = 123;

      component.onDeleteConfirmed();

      expect(fakeAudioRequestService.deleteAudioRequests).toHaveBeenCalledWith(123);

      expect(routerSpy).toHaveBeenCalledWith(['/audios']);
    });

    it('should set isDeleting to false on deletion error', () => {
      const error = new HttpErrorResponse({ status: 500 });
      fakeAudioRequestService.deleteAudioRequests.mockReturnValue(of(error));
      component.requestId = 123;

      component.onDeleteConfirmed();

      expect(fakeAudioRequestService.deleteAudioRequests).toHaveBeenCalledWith(123);
      expect(component.isDeleting).toBe(false);
    });

    it('should download audio and call saveAs', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' });
      fakeAudioRequestService.downloadAudio.mockReturnValue(of(mockBlob));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saveAsSpy = jest.spyOn(component.downloadService, 'saveAs');

      component.onDownloadClicked();

      expect(fakeAudioRequestService.downloadAudio).toHaveBeenCalledWith(12378, 'PLAYBACK');

      expect(saveAsSpy).toHaveBeenCalledWith(mockBlob, 'T20200331.mp3');
    });
  });

  describe('With audioRequestView set to null', () => {
    const audioRequestService = {
      audioRequestView: null,
      patchAudioRequestLastAccess: () => of(new HttpResponse<Response>({ status: 200 })),
      deleteAudioRequests: jest.fn(),
      downloadAudio: jest.fn(),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AudioViewComponent, HttpClientTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AudioRequestService, useValue: audioRequestService },
          { provide: Router, useValue: { navigate: jest.fn() } },
          { provide: AppConfigService, useValue: appConfigServiceMock },
        ],
      });
      fixture = TestBed.createComponent(AudioViewComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router) as jest.Mocked<Router>;
      fixture.detectChanges();
    });

    it('should navigate to /audios on null audioRequestView', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(['/audios']);
    });
  });
});
