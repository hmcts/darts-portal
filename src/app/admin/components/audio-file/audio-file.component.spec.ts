import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { AudioFile } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AdminSearchService } from '@services/admin-search/admin-search.service';
import { CaseService } from '@services/case/case.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AudioFileComponent } from './audio-file.component';

const dateTime = DateTime.fromISO('2024-07-04T11:24:12.101+01:00');

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
  checksum: '',
  mediaStatus: '',
  isHidden: false,
  isDeleted: false,
  adminAction: {
    id: 0,
    reasonId: 0,
    hiddenById: 99,
    hiddenByName: undefined,
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
      caseNumber: 'C1',
      courthouse: {
        id: 0,
        displayName: 'Courthouse 1',
      },
      courtroom: {
        id: 0,
        name: 'Courtroom 1',
      },
    },
    {
      id: 1,
      hearingDate: dateTime,
      caseId: 1,
      caseNumber: 'C2',
      courthouse: {
        id: 1,
        displayName: 'Courthouse 2',
      },
      courtroom: {
        id: 1,
        name: 'Courtroom 2',
      },
    },
  ],
  cases: [
    {
      id: 0,
      courthouse: {
        id: 0,
        displayName: 'Courthouse 1',
      },
      caseNumber: 'C1',
      source: 'Source 1',
    },
    {
      id: 1,
      courthouse: {
        id: 1,
        displayName: 'Courthouse 2',
      },
      caseNumber: 'C2',
      source: 'Source 2',
    },
  ],
};

const fileHide: FileHide = {
  id: 100,
  isHidden: false,
  isDeleted: false,
  adminAction: {
    id: 0,
    reasonId: 0,
    hiddenById: 99,
    hiddenAt: dateTime,
    isMarkedForManualDeletion: false,
    markedForManualDeletionById: 99,
    markedForManualDeletionAt: dateTime,
    ticketReference: 'refy ref',
    comments: 'commenty comment',
  },
};

describe('AudioFileComponent', () => {
  let component: AudioFileComponent;
  let fixture: ComponentFixture<AudioFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioFileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 100 } } } },
        {
          provide: CaseService,
          useValue: {
            getCase: jest
              .fn()
              .mockReturnValue(of({ id: 0, number: 'C1', defendants: ['defendant'], judges: ['judge'] })),
          },
        },
        { provide: UserService, useValue: { isAdmin: () => true } },
        {
          provide: UserAdminService,
          useValue: { getUsersById: jest.fn().mockReturnValue(of([{ id: 99, fullName: 'full name' }])) },
        },
        {
          provide: TransformedMediaService,
          useValue: {
            unhideAudioFile: jest.fn().mockReturnValue(of(fileHide)),
            getMediaById: jest.fn().mockReturnValue(of(audioFile)),
            checkAssociatedAudioExists: jest.fn().mockReturnValue(of({ exists: true })),
          },
        },
        {
          provide: TranscriptionAdminService,
          useValue: { getHiddenReason: jest.fn().mockReturnValue(of({ displayName: 'because of reasons' })) },
        },
        {
          provide: AdminSearchService,
          useValue: {
            fetchNewAudio: { set: jest.fn() },
          },
        },
        DatePipe,
        provideHttpClient(),
      ],
    });

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
      expect(component.userAdminService.getUsersById).toHaveBeenCalledTimes(1);
    });

    it('resolves user full name properties', fakeAsync(() => {
      const expected = {
        ...audioFile,
        createdBy: 'full name',
        lastModifiedBy: 'full name',
        adminAction: {
          ...audioFile.adminAction,
          hiddenByName: 'full name',
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
      const expected: HiddenFileBanner = {
        id: 100,
        isHidden: false,
        isApprovedForManualDeletion: false,
        markedForManualDeletionBy: 'full name',
        hiddenByName: 'full name',
        hiddenReason: 'because of reasons',
        ticketReference: 'refy ref',
        comments: 'commenty comment',
        fileType: 'audio_file',
        isMarkedForDeletion: false,
      };

      component.fileBanner$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      tick();
    }));
  });

  describe('associatedCases$', () => {
    it('maps source and courthouse to associated cases', fakeAsync(() => {
      const expected = [
        {
          caseId: 0,
          caseNumber: 'C1',
          courthouse: 'Courthouse 1',
          source: 'Source 1',
        },
        {
          caseId: 1,
          caseNumber: 'C2',
          courthouse: 'Courthouse 2',
          source: 'Source 2',
        },
      ];

      component.associatedCases$.subscribe((result) => {
        expect(result).toEqual(expected);
      });
      tick();
    }));
  });

  describe('associatedHearings$', () => {
    it('maps hearing date, courthouse and courtroom to associated hearings', fakeAsync(() => {
      const expected = [
        {
          caseId: 0,
          hearingId: 0,
          caseNumber: 'C1',
          courthouse: 'Courthouse 1',
          hearingDate: dateTime,
          courtroom: 'Courtroom 1',
        },
        {
          caseId: 1,
          hearingId: 1,
          caseNumber: 'C2',
          courthouse: 'Courthouse 2',
          hearingDate: dateTime,
          courtroom: 'Courtroom 2',
        },
      ];

      component.associatedHearings$.subscribe((result) => {
        expect(result).toEqual(expected);
      });

      tick();
    }));
  });

  describe('hide or delete button', () => {
    it('"Unhide" text when hidden', fakeAsync(() => {
      jest
        .spyOn(component.transformedMediaService, 'getMediaById')
        .mockReturnValue(of({ ...audioFile, isHidden: true }));
      fixture = TestBed.createComponent(AudioFileComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('button').textContent).toContain('Unhide');
    }));

    it('"Hide" text when not hidden', fakeAsync(() => {
      component.audioFile$ = of({ ...audioFile, isHidden: false });
      fixture.detectChanges();
      tick();
      expect(fixture.nativeElement.querySelector('button').textContent).toContain('Hide or delete');
    }));

    it('"Unmark for manual deletion and" text when marked for manual deletion and hidden', fakeAsync(() => {
      jest
        .spyOn(component.transcriptionAdminService, 'getHiddenReason')
        .mockReturnValue(of({ displayName: 'reason 1', markedForDeletion: true } as HiddenReason));
      jest.spyOn(component.transformedMediaService, 'getMediaById').mockReturnValue(
        of({
          ...audioFile,
          isHidden: true,
          adminAction: audioFile.adminAction
            ? { ...audioFile.adminAction, isApprovedForManualDeletion: false }
            : undefined,
        })
      );
      fixture = TestBed.createComponent(AudioFileComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('button').textContent).toContain('Unmark for deletion and unhide');
    }));
  });

  describe('hideOrUnhideFile', () => {
    it('should set fetchNewAudio to true after unhiding the file', fakeAsync(() => {
      const setFetchNewAudioSpy = jest.spyOn(component.searchService.fetchNewAudio, 'set');

      const file = {
        ...audioFile,
        isHidden: true,
        adminAction: {
          ...audioFile.adminAction,
          isMarkedForManualDeletion: false,
        },
      } as AudioFile;

      jest
        .spyOn(component.transformedMediaService, 'checkAssociatedAudioExists')
        .mockReturnValue(of({ exists: false, audioFile: [], media: [] }));

      fixture.detectChanges();
      component.hideOrUnhideFile(file);
      tick();

      expect(setFetchNewAudioSpy).toHaveBeenCalledWith(true);
    }));

    it('should route to associated audio unhide component if file has associated media', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      jest
        .spyOn(component.transformedMediaService, 'checkAssociatedAudioExists')
        .mockReturnValue(of({ exists: true, audioFile: [], media: [] }));

      const file = {
        ...audioFile,
        isHidden: true,
        adminAction: audioFile.adminAction ? { ...audioFile.adminAction, isMarkedForManualDeletion: true } : undefined,
      };

      component.hideOrUnhideFile(file);

      expect(routerSpy).toHaveBeenCalledWith(
        ['/admin/audio-file', 100, 'associated-audio', 'unhide-or-unmark-for-deletion'],
        {
          state: {
            media: [],
          },
        }
      );
    });

    it('should unhide the audio file if it is hidden', () => {
      const file = {
        ...audioFile,
        isHidden: true,
        adminAction: audioFile.adminAction ? { ...audioFile.adminAction, isMarkedForManualDeletion: true } : undefined,
      };

      jest
        .spyOn(component.transformedMediaService, 'checkAssociatedAudioExists')
        .mockReturnValue(of({ exists: false, audioFile: [], media: [] }));

      fixture.detectChanges();

      const unhideAudioSpy = jest.spyOn(component.transformedMediaService, 'unhideAudioFile');
      component.hideOrUnhideFile(file);

      expect(unhideAudioSpy).toHaveBeenCalledWith(100);
    });

    it('should navigate to the hide-or-delete page if the audio file is not hidden', () => {
      component.mediaId = 2;
      const routerSpy = jest.spyOn(component.router, 'navigate');

      const file = {
        ...audioFile,
        isHidden: false,
      };

      component.hideOrUnhideFile(file);

      expect(routerSpy).toHaveBeenCalledWith(['admin/file', 100, 'hide-or-delete'], {
        state: {
          fileType: 'audio_file',
          hearings: [0, 1],
          dates: {
            startAt: '2024-07-04T11:24:12.101+01:00',
            endAt: '2024-07-04T11:24:12.101+01:00',
          },
          mediaId: 2,
        },
      });
    });
  });
});
