import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { DateTime } from 'luxon';
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

  const mockTranscript: TranscriptionDetails = {
    caseId: 1,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    transcriptionObjectId: 1,
    courtroom: '1',
    status: 'Rejected',
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
    courthouseId: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedTranscriptComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        DatePipe,
        LuxonDatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectedTranscriptComponent);
    component = fixture.componentInstance;
    component.transcript = mockTranscript;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
