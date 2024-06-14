import { AudioFile } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from '@services/case/case.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AudioFileComponent } from './audio-file.component';

const dateTime = DateTime.now();

const audioFile: AudioFile = {
  id: 100,
  startAt: dateTime,
  endAt: dateTime,
  channel: 0,
  totalChannels: 0,
  mediaType: '',
  mediaFormat: '',
  fileSizeBytes: 0,
  filename: '',
  mediaObjectId: '',
  contentObjectId: '',
  clipId: '',
  referenceId: '',
  checksum: '',
  mediaStatus: '',
  isHidden: false,
  isDeleted: false,
  adminAction: {
    id: 0,
    reasonId: 0,
    hiddenById: 99,
    hiddenBy: undefined,
    hiddenAt: dateTime,
    isMarkedForManualDeletion: false,
    markedForManualDeletionById: 99,
    markedForManualDeletionBy: undefined,
    markedForManualDeletionAt: dateTime,
    ticketReference: 'refy ref',
    comments: 'commenty comment',
  },
  version: '',
  chronicleId: '',
  antecedentId: '',
  retainUntil: dateTime,
  createdAt: dateTime,
  createdById: 99,
  createdBy: undefined,
  lastModifiedAt: dateTime,
  lastModifiedById: 99,
  lastModifiedBy: undefined,
  courthouse: {
    id: 0,
    displayName: '',
  },
  courtroom: {
    id: 0,
    name: '',
  },
  hearings: [
    {
      id: 0,
      hearingDate: dateTime,
      caseId: 0,
    },
    {
      id: 1,
      hearingDate: dateTime,
      caseId: 0,
    },
  ],
};

describe('AudioFileComponent', () => {
  let component: AudioFileComponent;
  let fixture: ComponentFixture<AudioFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioFileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 100 } } } },
        {
          provide: CaseService,
          useValue: { getCase: jest.fn().mockReturnValue(of({ id: 0, defendants: ['defendant'], judges: ['judge'] })) },
        },
        { provide: UserService, useValue: { isAdmin: () => true } },
        {
          provide: UserAdminService,
          useValue: { getUsersById: jest.fn().mockReturnValue(of([{ id: 99, fullName: 'full name' }])) },
        },
        { provide: TransformedMediaService, useValue: { getMediaById: jest.fn().mockReturnValue(of(audioFile)) } },
        {
          provide: TranscriptionAdminService,
          useValue: { getHiddenReason: jest.fn().mockReturnValue(of({ displayName: 'because of reasons' })) },
        },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('audioFileId', () => {
    it('should return the id from the route params', () => {
      expect(component.audioFileId).toBe(100);
    });
  });

  describe('audioFile$', () => {
    it('calls getMediaById with the audioFileId', () => {
      component.audioFile$.subscribe();
      expect(component.transformedMediaService.getMediaById).toHaveBeenCalledWith(100);
    });

    it('only makes service calls once (shareReplay(1))', () => {
      component.audioFile$.subscribe();
      component.audioFile$.subscribe();

      expect(component.transformedMediaService.getMediaById).toHaveBeenCalledTimes(1);
      expect(component.UserAdminService.getUsersById).toHaveBeenCalledTimes(1);
    });

    it('resolves user full name properties', fakeAsync(() => {
      const expected = {
        ...audioFile,
        createdBy: 'full name',
        lastModifiedBy: 'full name',
        adminAction: {
          ...audioFile.adminAction,
          hiddenBy: 'full name',
          markedForManualDeletionBy: 'full name',
        },
      };

      component.audioFile$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      tick();
    }));
  });

  describe('fileBanner$', () => {
    it('calls getHiddenReason with the audioFile', () => {
      component.fileBanner$.subscribe();
      expect(component.transcriptionAdminService.getHiddenReason).toHaveBeenCalledWith(0);
    });

    it('maps the audioFile details to a HiddenFileBanner', fakeAsync(() => {
      const expected = {
        id: 100,
        isHidden: false,
        isMarkedForManualDeletion: false,
        markedForManualDeletionBy: 'full name',
        hiddenReason: 'because of reasons',
        ticketReference: 'refy ref',
        comments: 'commenty comment',
        fileType: 'audio_file',
      };

      component.fileBanner$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      tick();
    }));
  });

  describe('associatedCases$', () => {
    it('calls getCase for each caseId', () => {
      component.associatedCases$.subscribe();
      expect(component.caseService.getCase).toHaveBeenCalledWith(0);
      expect(component.caseService.getCase).toHaveBeenCalledTimes(2);
    });

    it('maps judges and defendents to associated cases', fakeAsync(() => {
      const expected = [
        {
          caseId: 0,
          hearingDate: dateTime,
          defendants: ['defendant'],
          judges: ['judge'],
        },
        {
          caseId: 0,
          hearingDate: dateTime,
          defendants: ['defendant'],
          judges: ['judge'],
        },
      ];

      component.associatedCases$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      tick();
    }));
  });
});
