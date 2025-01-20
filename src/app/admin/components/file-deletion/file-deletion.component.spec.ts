import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { FileDeletionComponent } from './file-deletion.component';

const audioFiles: AudioFileMarkedDeletion[] = [
  {
    media: [
      {
        id: 1,
        channel: 2,
        totalChannels: 3,
        isCurrent: true,
        versionCount: 4,
      },
    ],
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: 'Courthouse A',
    courtroom: 'Courtroom 1',
    hiddenById: 3,
    comments: ['Audio file marked for deletion'],
    ticketReference: 'TICKET-001',
    reasonId: 4,
  },
  {
    media: [
      {
        id: 5,
        channel: 6,
        totalChannels: 7,
        isCurrent: true,
        versionCount: 8,
      },
    ],
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: 'Courthouse B',
    courtroom: 'Courtroom 2',
    hiddenById: 7,
    comments: ['Audio file marked for deletion'],
    ticketReference: 'TICKET-002',
    reasonId: 8,
  },
  {
    media: [
      {
        id: 9,
        channel: 10,
        totalChannels: 11,
        isCurrent: true,
        versionCount: 12,
      },
    ],
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: 'Courthouse C',
    courtroom: 'Courtroom 3',
    hiddenById: 11,
    comments: ['Audio file marked for deletion'],
    ticketReference: 'TICKET-003',
    reasonId: 12,
  },
];

const transcriptionDocuments: TranscriptionDocumentForDeletion[] = [
  {
    transcriptionDocumentId: 1,
    transcriptionId: 2,
    caseNumber: '123',
    hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    courthouse: 'Cardiff',
    courtroom: 'Room 1',
    hiddenById: 3,
    comments: 'Commenty comment',
    ticketReference: 'REF123',
    reasonId: 4,
  },
];

describe('FileDeletionComponent', () => {
  let component: FileDeletionComponent;
  let fixture: ComponentFixture<FileDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDeletionComponent],
      providers: [
        {
          provide: FileDeletionService,
          useValue: {
            getAudioFilesMarkedForDeletion: jest.fn().mockReturnValue(of(audioFiles)),
            getTranscriptionDocumentsMarkedForDeletion: jest.fn().mockReturnValue(of(transcriptionDocuments)),
          },
        },
        ActiveTabService,

        LuxonDatePipe,
        DatePipe,
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDeletionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch audio files marked for deletion', () => {
    fixture.detectChanges();

    expect(component.audioFiles()).toEqual(audioFiles);
    expect(component.audioCount()).toBe(audioFiles.length);
    expect(component.isLoading()).toBe(false);
  });

  it('should fetch transcription documents marked for deletion', () => {
    fixture.detectChanges();

    expect(component.transcripts()).toEqual(transcriptionDocuments);
    expect(component.transcriptCount()).toBe(transcriptionDocuments.length);
    expect(component.isLoading()).toBe(false);
  });

  describe('onTabChange', () => {
    it('should set the active tab', () => {
      fixture.detectChanges();

      component.onTabChange('Transcripts');

      expect(component.tab()).toBe('Transcripts');
    });

    it('should set the active tab in the active tab service', () => {
      fixture.detectChanges();
      const setActiveTabSpy = jest.spyOn(component.activeTabService, 'setActiveTab');

      component.onTabChange('Transcripts');

      expect(setActiveTabSpy).toHaveBeenCalledWith('file-deletion', 'Transcripts');
    });
  });

  describe('onDeleteTranscript', () => {
    it('navigates to the unauthorised page if the user has hidden the transcript', () => {
      const transcript = transcriptionDocuments[0];
      component.userService = {
        hasMatchingUserId: jest.fn().mockReturnValue(true),
      } as unknown as UserService;
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.onDeleteTranscript(transcript);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion/unauthorised'], { state: { type: 'transcript' } });
    });

    it('does navigate to the delete page if the user has not hidden the transcript', () => {
      const transcript = transcriptionDocuments[0];
      component.userService = {
        hasMatchingUserId: jest.fn().mockReturnValue(false),
      } as unknown as UserService;
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.onDeleteTranscript(transcript);

      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion/transcript', 1], {
        state: {
          file: {
            caseNumber: '123',
            comments: 'Commenty comment',
            courthouse: 'Cardiff',
            courtroom: 'Room 1',
            hearingDate: transcript.hearingDate.toISO(),
            hiddenById: 3,
            reasonId: 4,
            ticketReference: 'REF123',
            transcriptionDocumentId: 1,
            transcriptionId: 2,
          },
        },
      });
    });
  });

  describe('onDeleteAudio', () => {
    it('navigates to the unauthorised page if the user has hidden the audio', () => {
      const audio = audioFiles[0];
      component.userService = {
        hasMatchingUserId: jest.fn().mockReturnValue(true),
      } as unknown as UserService;
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.onDeleteAudio(audio);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion/unauthorised'], { state: { type: 'audio' } });
    });

    it('does navigate to the delete page if the user has not hidden the audio', () => {
      const audio = audioFiles[0];
      component.userService = {
        hasMatchingUserId: jest.fn().mockReturnValue(false),
      } as unknown as UserService;
      const routerSpy = jest.spyOn(component.router, 'navigate');

      const expectedAudio = { ...audio, startAt: audio.startAt.toISO(), endAt: audio.endAt.toISO() };

      component.onDeleteAudio(audio);

      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion/audio'], {
        state: {
          file: expectedAudio,
        },
      });
    });
  });
});
