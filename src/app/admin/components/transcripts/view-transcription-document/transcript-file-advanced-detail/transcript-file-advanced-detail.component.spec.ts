import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionDocument } from '@admin-types/transcription/transcription-document';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { DateTime } from 'luxon';
import { TranscriptFileAdvancedDetailComponent } from './transcript-file-advanced-detail.component';

describe('TranscriptFileAdvancedDetailComponent', () => {
  let component: TranscriptFileAdvancedDetailComponent;
  let fixture: ComponentFixture<TranscriptFileAdvancedDetailComponent>;

  const document: TranscriptionDocument = {
    transcriptionId: 1,
    transcriptionDocumentId: 0,
    fileType: '',
    fileName: '',
    fileSizeBytes: 0,
    uploadedAt: DateTime.fromISO('2020-01-01'),
    uploadedBy: 0,
    uploadedByObj: {
      id: 1,
      fullName: 'Dean',
      isSystemUser: false,
    },
    isHidden: true,
    retainUntil: DateTime.fromISO('2020-01-01'),
    contentObjectId: '',
    checksum: '',
    clipId: '',
    lastModifiedAt: DateTime.fromISO('2020-01-01'),
    lastModifiedBy: 0,
    lastModifiedByObj: {
      id: 2,
      fullName: 'Dave',
      isSystemUser: false,
    },
    adminAction: {
      id: 0,
      reasonId: 1,
      hiddenById: 0,
      hiddenByName: 'Bob',
      hiddenByIsSystemUser: false,
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
      imports: [TranscriptFileAdvancedDetailComponent],
      providers: [
        LuxonDatePipe,
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { transcriptionDocumentId: 1 } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptFileAdvancedDetailComponent);
    component = fixture.componentInstance;
    component.transcription = {
      document: document,
      details: details,
    };
    fixture.detectChanges();
  });

  it('should setup links for non-system users', () => {
    expect(component).toBeTruthy();
    const lastModifiedBy = component.advancedDetails?.['Last modified by'];
    const uploadedBy = component.advancedDetails?.['Uploaded by'];
    const hiddenBy = component.advancedDetails?.['Hidden by'];
    expect(lastModifiedBy).toEqual([{ href: '/admin/users/2', value: 'Dave' }]);
    expect(uploadedBy).toEqual([{ href: '/admin/users/1', value: 'Dean' }]);
    expect(hiddenBy).toEqual([{ href: '/admin/users/0', value: 'Bob' }]);
  });

  it('should not setup links for system users', () => {
    if (component.transcription.document.lastModifiedByObj) {
      component.transcription.document.lastModifiedByObj.isSystemUser = true;
    }
    if (component.transcription.document.uploadedByObj) {
      component.transcription.document.uploadedByObj.isSystemUser = true;
    }
    if (component.transcription.document.adminAction) {
      component.transcription.document.adminAction.hiddenByIsSystemUser = true;
    }
    fixture.detectChanges();
    component.ngOnInit();
    const lastModifiedBy = component.advancedDetails?.['Last modified by'];
    const uploadedBy = component.advancedDetails?.['Uploaded by'];
    const hiddenBy = component.advancedDetails?.['Hidden by'];
    expect(lastModifiedBy).toBe('Dave');
    expect(uploadedBy).toBe('Dean');
    expect(hiddenBy).toBe('Bob');
  });
});
