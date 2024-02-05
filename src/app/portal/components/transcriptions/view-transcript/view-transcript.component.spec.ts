import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs/internal/observable/of';
import { FileDownloadService } from 'src/app/core/services/file-download/file-download.service';
import { ViewTranscriptComponent } from './view-transcript.component';

describe('ViewTranscriptComponent', () => {
  let component: ViewTranscriptComponent;
  let fixture: ComponentFixture<ViewTranscriptComponent>;

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
    hearingDate: DateTime.fromISO('2023-11-08'),
    urgency: '',
    requestType: '',
    transcriptionId: 0,
    transcriptionStartTs: DateTime.fromISO('2023-11-08'),
    transcriptionEndTs: DateTime.fromISO('2023-11-08'),
    isManual: false,
    hearingId: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewTranscriptComponent, HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: TranscriptionService,
          useValue: {
            getTranscriptionDetails: jest.fn().mockReturnValue(of(mockTransctiptionDetails)),
          },
        },
        {
          provide: FileDownloadService,
          useValue: {
            saveAs: jest.fn(),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ViewTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.transcriptionService.getTranscriptionDetails).toHaveBeenCalledWith('2');
    expect(component.transcriptId).toEqual('2');
  });
});
