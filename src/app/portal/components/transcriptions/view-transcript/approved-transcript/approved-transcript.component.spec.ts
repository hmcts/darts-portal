import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ApprovedTranscriptComponent } from './approved-transcript.component';

describe('ApprovedTranscriptComponent', () => {
  let component: ApprovedTranscriptComponent;
  let fixture: ComponentFixture<ApprovedTranscriptComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        transcriptId: 12,
      },
    },
  };

  const mockTranscriptionDetails: TranscriptionDetails = {
    caseId: 1,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    transcriptionObjectId: 1,
    courtroom: '1',
    status: 'Approved',
    from: 'MoJ CH Swansea',
    received: DateTime.fromISO('2023-11-17T12:53:07.468Z'),
    requestorComments: 'Please expedite my request',
    rejectionReason: 'This request will take longer to transcribe within the urgency level you require.',
    defendants: ['Defendant Dave', 'Defendant Bob'],
    judges: ['HHJ M. Hussain KC	', 'Ray Bob'],
    transcriptFileName: 'C20220620001_0.docx',
    hearingDate: DateTime.fromISO('2023-11-08'),
    urgency: {
      transcription_urgency_id: 1,
      description: 'Standard',
      priority_order: 1,
    },
    requestType: 'Specified Times',
    transcriptionId: 12,
    transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00Z'),
    transcriptionEndTs: DateTime.fromISO('2023-06-26T16:00:00Z'),
    isManual: true,
    hearingId: 1,
    caseReportingRestrictions: [],
    courthouseId: 1,
  };

  const blob = new Blob();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedTranscriptComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DatePipe },
        {
          provide: TranscriptionService,
          useValue: {
            getTranscriptionDetails: jest.fn().mockReturnValue(of(mockTranscriptionDetails)),
            downloadTranscriptDocument: jest.fn().mockReturnValue(of(blob)),
            getCaseDetailsFromTranscript: jest.fn(),
            getRequestDetailsFromTranscript: jest.fn(),
          },
        },
        {
          provide: FileDownloadService,
          useValue: {
            saveAs: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovedTranscriptComponent);
    component = fixture.componentInstance;
    component.transcript = mockTranscriptionDetails;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onDownloadClicked', () => {
    it('calls downloadTranscriptDocument', () => {
      component.onDownloadClicked();
      expect(component.transcriptionService.downloadTranscriptDocument).toHaveBeenCalledWith(12);
      expect(component.fileDownloadService.saveAs).toHaveBeenCalledWith(blob, 'C20220620001_0.docx');
    });
  });
});
