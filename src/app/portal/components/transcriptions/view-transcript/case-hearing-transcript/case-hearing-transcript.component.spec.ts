import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
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
    caseId: 0,
    caseNumber: '',
    courthouse: '',
    defendants: [],
    judges: [],
    transcriptFileName: 'test-file-name.docx',
    hearingDate: DateTime.fromISO('2021-01-01'),
    urgency: '',
    requestType: '',
    transcriptionId: 0,
    transcriptionStartTs: DateTime.fromISO('2021-01-01'),
    transcriptionEndTs: DateTime.fromISO('2021-01-01'),
    isManual: false,
    hearingId: 0,
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
