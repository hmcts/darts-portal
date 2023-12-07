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
      data: {
        userState: {
          userId: 123,
          userName: 'dev@local',
          roles: [
            {
              roleId: 123,
              roleName: 'local dev',
              permissions: [
                {
                  permissionId: 1,
                  permissionName: 'local dev permissions',
                },
              ],
            },
          ],
        },
      },
      params: {
        hearing_id: '1',
        transcriptId: '2',
      },
      queryParams: { tab: 'Transcripts' },
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewTranscriptComponent, HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: TranscriptionService,
          useValue: {
            getTranscriptionDetails: jest.fn().mockReturnValue(of(mockTransctiptionDetails)),
            downloadTranscriptDocument: jest.fn().mockReturnValue(of(blob)),
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
    expect(component.fileName).toEqual('test-file-name.docx');
  });

  describe('#onDownloadClicked', () => {
    it('calls downloadTranscriptDocument', () => {
      component.onDownloadClicked();
      expect(component.transcriptionService.downloadTranscriptDocument).toHaveBeenCalledWith('2');
      expect(component.fileDownloadService.saveAs).toHaveBeenCalledWith(blob, 'test-file-name.docx');
    });
  });
});
