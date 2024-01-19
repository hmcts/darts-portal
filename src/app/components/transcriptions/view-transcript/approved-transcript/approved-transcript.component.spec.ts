import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
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

  const mockTranscriptionDetails = {
    case_id: 1,
    case_reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    case_number: 'C20220620001',
    courthouse: 'Swansea',
    status: 'Approved',
    from: 'MoJ CH Swansea',
    received: '2023-11-17T12:53:07.468Z',
    requestor_comments: 'Please expedite my request',
    defendants: ['Defendant Dave', 'Defendant Bob'],
    judges: ['HHJ M. Hussain KC	', 'Ray Bob'],
    transcript_file_name: 'C20220620001_0.docx',
    hearing_date: '2023-11-08',
    urgency: 'Standard',
    request_type: 'Specified Times',
    request_id: 123456789,
    transcription_start_ts: '2023-06-26T13:00:00Z',
    transcription_end_ts: '2023-06-26T16:00:00Z',
    is_manual: true,
    hearing_id: 1,
  } as unknown as TranscriptionDetails;

  const blob = new Blob();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedTranscriptComponent, HttpClientTestingModule],
      providers: [
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
