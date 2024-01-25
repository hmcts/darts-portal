import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { of } from 'rxjs';
import { CaseHearingTranscriptComponent } from './case-hearing-transcript.component';

describe('CaseHearingTranscriptComponent', () => {
  let component: CaseHearingTranscriptComponent;
  let fixture: ComponentFixture<CaseHearingTranscriptComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        hearing_id: '1',
        transcriptId: '2',
      },
    },
  };

  const mockTransctiptionDetails: TranscriptionDetails = {
    case_id: 0,
    case_number: '',
    courthouse: '',
    defendants: [],
    judges: [],
    transcript_file_name: 'test-file-name.docx',
    hearing_date: '',
    urgency: '',
    request_type: '',
    transcription_id: 0,
    transcription_start_ts: '',
    transcription_end_ts: '',
    is_manual: false,
    hearing_id: 0,
  };

  const blob = new Blob();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseHearingTranscriptComponent, DatePipe],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: TranscriptionService,
          useValue: {
            downloadTranscriptDocument: jest.fn().mockReturnValue(of(blob)),
            getCaseDetailsFromTranscript: jest.fn(),
            getHearingRequestDetailsFromTranscript: jest.fn(),
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

    fixture = TestBed.createComponent(CaseHearingTranscriptComponent);
    component = fixture.componentInstance;
    component.transcript = mockTransctiptionDetails;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onDownloadClicked', () => {
    it('calls downloadTranscriptDocument', () => {
      component.onDownloadClicked();
      expect(component.transcriptionService.downloadTranscriptDocument).toHaveBeenCalledWith('2');
      expect(component.fileDownloadService.saveAs).toHaveBeenCalledWith(blob, 'test-file-name.docx');
    });
  });
});
