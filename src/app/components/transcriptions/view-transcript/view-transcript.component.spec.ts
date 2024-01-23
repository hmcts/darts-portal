import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranscriptionService } from '@services/transcription/transcription.service';

import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { of } from 'rxjs/internal/observable/of';
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
