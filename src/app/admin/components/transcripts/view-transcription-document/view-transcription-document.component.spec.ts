import { TranscriptionDocument, User } from '@admin-types/index';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ViewTranscriptionDocumentComponent } from './view-transcription-document.component';

const mockUsers: User[] = [
  {
    id: 1,
    fullName: 'Dean',
  },
  {
    id: 2,
    fullName: 'Dave',
  },
] as User[];

const hiddenReasons = [
  {
    id: 1,
    displayName: 'Reason 1',
  },
  {
    id: 2,
    displayName: 'Reason 2',
  },
] as unknown as HiddenReason[];

const mockTranscriptionDocument: TranscriptionDocument = {
  transcriptionId: 1,
  transcriptionDocumentId: 0,
  fileType: '',
  fileName: '',
  fileSizeBytes: 0,
  uploadedAt: DateTime.fromISO('2020-01-01'),
  uploadedBy: 2,
  isHidden: true,
  retainUntil: DateTime.fromISO('2020-01-01'),
  contentObjectId: '',
  checksum: '',
  clipId: '',
  lastModifiedAt: DateTime.fromISO('2020-01-01'),
  lastModifiedBy: 1,
  lastModifiedByName: 'Dean',
  uploadedByName: 'Dave',
  adminAction: {
    id: 0,
    reasonId: 1,
    hiddenById: 1,
    markedForManualDeletionBy: 'Dave',
    hiddenByName: 'Dean',
    hiddenAt: DateTime.fromISO('2020-01-01'),
    isMarkedForManualDeletion: false,
    markedForManualDeletionById: 2,
    markedForManualDeletionAt: DateTime.fromISO('2020-01-01'),
    ticketReference: '',
    comments: '',
  },
};

const mockTranscriptionDetails: TranscriptionDetails = {
  caseId: 0,
  caseNumber: '',
  courthouse: '',
  courtroom: '',
  defendants: [],
  judges: [],
  transcriptFileName: '',
  hearingDate: DateTime.fromISO('2020-01-01'),
  urgency: {
    transcription_urgency_id: 0,
    description: '',
  },
  requestType: '',
  transcriptionId: 0,
  transcriptionStartTs: DateTime.fromISO('2020-01-01'),
  transcriptionEndTs: DateTime.fromISO('2020-01-01'),
  transcriptionObjectId: 0,
  isManual: false,
  hearingId: 0,
};

describe('ViewTranscriptionDocumentComponent', () => {
  let component: ViewTranscriptionDocumentComponent;
  let fixture: ComponentFixture<ViewTranscriptionDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTranscriptionDocumentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                transcriptionDocumentId: 1,
              },
            },
          },
        },
        LuxonDatePipe,
        DatePipe,
        {
          provide: TranscriptionAdminService,
          useValue: {
            getTranscriptionDocument: jest.fn().mockReturnValue(of(mockTranscriptionDocument)),
            getHiddenReason: jest.fn().mockReturnValue(of(hiddenReasons[0])),
          },
        },
        {
          provide: TranscriptionService,
          useValue: {
            getTranscriptionDetails: jest.fn().mockReturnValue(of(mockTranscriptionDetails)),
          },
        },
        {
          provide: UserAdminService,
          useValue: {
            getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
          },
        },
        {
          provide: UserService,
          useValue: {
            isAdmin: jest.fn().mockReturnValue(true),
            isSuperUser: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTranscriptionDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transcription$', () => {
    it('should load the transcription document and associated audio', fakeAsync(() => {
      component.transcription$.subscribe((data) => {
        expect(data.document).toEqual(mockTranscriptionDocument);
        expect(data.details).toEqual(mockTranscriptionDetails);
        expect(data.fileBanner).toEqual({
          id: mockTranscriptionDocument.transcriptionId,
          isHidden: mockTranscriptionDocument.isHidden,
          isMarkedForManualDeletion: mockTranscriptionDocument.adminAction?.isMarkedForManualDeletion,
          markedForManualDeletionBy: mockTranscriptionDocument.adminAction?.markedForManualDeletionBy,
          hiddenReason: hiddenReasons[0]?.displayName,
          hiddenByName: mockTranscriptionDocument.adminAction?.hiddenByName,
          ticketReference: mockTranscriptionDocument.adminAction?.ticketReference,
          comments: mockTranscriptionDocument.adminAction?.comments,
          fileType: 'transcription_document',
        });
      });
      tick();
    }));

    it('should set loading to false', fakeAsync(() => {
      component.transcription$.subscribe(() => {
        expect(component.loading()).toBe(false);
      });
      tick();
    }));
  });

  it('should navigate to "/admin/transcripts" when onBack is called', () => {
    const routerSpy = jest.spyOn(component.router, 'navigate');
    component.onBack();
    expect(routerSpy).toHaveBeenCalledWith(['/admin/transcripts']);
  });
});
