import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { RejectedTranscriptComponent } from './rejected-transcript.component';

describe('RejectedTranscriptComponent', () => {
  let component: RejectedTranscriptComponent;
  let fixture: ComponentFixture<RejectedTranscriptComponent>;

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
    status: 'Rejected',
    from: 'MoJ CH Swansea',
    received: '2023-11-17T12:53:07.468Z',
    requestor_comments: 'Please expedite my request',
    rejection_reason: 'This request will take longer to transcribe within the urgency level you require.',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedTranscriptComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }, { provide: DatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectedTranscriptComponent);
    component = fixture.componentInstance;
    component.transcript = mockTranscriptionDetails;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
