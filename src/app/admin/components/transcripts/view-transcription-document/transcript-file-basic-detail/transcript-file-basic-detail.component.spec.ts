import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionDocument } from '@admin-types/transcription';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { DateTime } from 'luxon';
import { TranscriptFileBasicDetailComponent } from './transcript-file-basic-detail.component';

describe('TranscriptFileBasicDetailComponent', () => {
  let component: TranscriptFileBasicDetailComponent;
  let fixture: ComponentFixture<TranscriptFileBasicDetailComponent>;

  const document: TranscriptionDocument = {
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
      isMarkedForManualDeletion: false,
      markedForManualDeletionById: 0,
      markedForManualDeletionAt: DateTime.fromISO('2020-01-01'),
      ticketReference: '',
      comments: '',
    },
  };

  const details: TranscriptionDetails = {
    caseId: 0,
    caseNumber: '',
    courthouse: '',
    courtroom: '',
    defendants: [],
    judges: [],
    transcriptFileName: '',
    hearingDate: DateTime.fromISO('2020-01-01T00:00:00.000Z'),
    urgency: {
      transcription_urgency_id: 1,
    },
    requestType: '',
    transcriptionId: 0,
    transcriptionStartTs: DateTime.fromISO('2020-01-01T00:08:00.000Z'),
    transcriptionEndTs: DateTime.fromISO('2020-01-01T00:10:00.000Z'),
    transcriptionObjectId: 0,
    isManual: false,
    hearingId: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptFileBasicDetailComponent],
      providers: [
        LuxonDatePipe,
        DatePipe,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { transcriptionDocumentId: 1 } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptFileBasicDetailComponent);
    component = fixture.componentInstance;
    component.transcription = {
      document: document,
      details: details,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
