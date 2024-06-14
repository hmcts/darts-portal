import { TranscriptionDocument, User } from '@admin-types/index';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
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
  uploadedBy: 0,
  isHidden: true,
  retainUntil: DateTime.fromISO('2020-01-01'),
  contentObjectId: '',
  checksum: '',
  clipId: '',
  lastModifiedAt: DateTime.fromISO('2020-01-01'),
  lastModifiedBy: 0,
  adminAction: {
    id: 0,
    reasonId: 1,
    hiddenById: 0,
    hiddenAt: DateTime.fromISO('2020-01-01'),
    hiddenByName: undefined,
    isMarkedForManualDeletion: false,
    markedForManualDeletionById: 0,
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

const mockAssociatedMedia: AssociatedMedia[] = [
  {
    id: 1,
    channel: 1,
    startAt: DateTime.fromISO('2020-01-01T01:00:00Z'),
    endAt: DateTime.fromISO('2020-01-01T02:00:00Z'),
    case: {
      id: 1,
      caseNumber: 'case-number',
    },
    hearing: {
      id: 1,
      hearingDate: DateTime.fromISO('2020-01-01'),
    },
    courthouse: {
      id: 1,
      displayName: 'courthouse',
    },
    courtroom: {
      id: 1,
      displayName: 'courtroom',
    },
  },
];

const router = {
  navigate: jest.fn(),
} as unknown as Router;

describe('ViewTranscriptionDocumentComponent', () => {
  let component: ViewTranscriptionDocumentComponent;
  let fixture: ComponentFixture<ViewTranscriptionDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTranscriptionDocumentComponent, HttpClientTestingModule],
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
        { provide: Router, useValue: router },
        {
          provide: TransformedMediaService,
          useValue: {
            getAssociatedMediaByTranscriptionDocumentId: jest.fn().mockReturnValue(of(mockAssociatedMedia)),
          },
        },
        {
          provide: UserAdminService,
          useValue: {
            getUser: jest.fn().mockReturnValue(of(mockUsers[0])),
            getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
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

  describe('data$', () => {
    it('should load the transcription document and associated audio', fakeAsync(() => {
      component.data$.subscribe((data) => {
        expect(data.transcription.document).toEqual(mockTranscriptionDocument);
        expect(data.transcription.details).toEqual(mockTranscriptionDetails);
        expect(data.transcription.hiddenReason).toEqual(hiddenReasons[0]);
        expect(data.associatedAudio).toEqual(mockAssociatedMedia);
      });
      tick();
    }));

    it('should set loading to false', fakeAsync(() => {
      component.data$.subscribe(() => {
        expect(component.loading()).toBe(false);
      });
      tick();
    }));
  });

  it('should navigate to "/admin/transcripts" when onBack is called', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/transcripts']);
  });
});
