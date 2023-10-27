import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { PlayButtonComponent } from '@common/play-button/play-button.component';
import { HearingEvent } from '@darts-types/hearing-event.interface';
import { Case, HearingEventRow, UserAudioRequestRow } from '@darts-types/index';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { HearingService } from '@services/hearing/hearing.service';
import { of } from 'rxjs';
import { AudioViewComponent } from './audio-view.component';

describe('AudioViewComponent', () => {
  let component: AudioViewComponent;
  let fixture: ComponentFixture<AudioViewComponent>;
  let patchAudioRequestLastAccessSpy: jest.SpyInstance;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        requestId: 111,
      },
    },
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

  const MOCK_AUDIO_REQUEST: UserAudioRequestRow = {
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
    output_filename: 'T20200331',
    output_format: 'mp3',
  };

  const fakeHearingService = {
    getEvents: () => of(MOCK_HEARING_EVENTS),
  };

  const fakeAudioRequestService = {
    audioRequestView: MOCK_AUDIO_REQUEST,
    patchAudioRequestLastAccess: () => of(),
    getDownloadUrl: () => 'api/download',
  };

  const fakeCaseService = {
    getCase: () => of(MOCK_CASE),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioViewComponent, PlayButtonComponent, AudioPlayerComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AudioRequestService, useValue: fakeAudioRequestService },
        { provide: HearingService, useValue: fakeHearingService },
        { provide: CaseService, useValue: fakeCaseService },
      ],
    });
    fixture = TestBed.createComponent(AudioViewComponent);
    component = fixture.componentInstance;
    patchAudioRequestLastAccessSpy = jest.spyOn(fakeAudioRequestService, 'patchAudioRequestLastAccess');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.audioPlayer).toBeTruthy();
  });

  describe('#constructor', () => {
    it('should set the audioRequest', () => {
      expect(component.audioRequest).toEqual(fakeAudioRequestService.audioRequestView);
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
    it('should set the audioUrl', () => {
      expect(component.downloadUrl).toEqual('api/download');
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
});
