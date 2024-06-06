import { TranscriptionDocument, User } from '@admin-types/index';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ViewTranscriptionDocumentComponent } from './view-transcription-document.component';

const mockUser: User = {
  id: 1,
  fullName: 'Dean',
} as User;

const mockTranscriptionDocument: TranscriptionDocument = {
  transcriptionId: 1,
  transcriptionDocumentId: 0,
  fileType: '',
  fileName: '',
  fileSizeBytes: 0,
  uploadedAt: DateTime.fromISO('2020-01-01'),
  uploadedBy: 0,
  isHidden: false,
};

const mockTranscriptionDetails: TranscriptionDetails = {
  caseId: 0,
  caseNumber: '',
  courthouse: '',
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
          },
        },
        {
          provide: TranscriptionService,
          useValue: {
            getTranscriptionDetails: jest.fn().mockReturnValue(of(mockTranscriptionDetails)),
          },
        },
        {
          provide: TransformedMediaService,
          useValue: {
            getAssociatedMediaByTranscriptionDocumentId: jest.fn().mockReturnValue(of(mockAssociatedMedia)),
          },
        },
        {
          provide: UserAdminService,
          useValue: {
            getUser: jest.fn().mockReturnValue(of(mockUser)),
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
        expect(data.transcription.uploadedByUser).toEqual(mockUser);
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
});
