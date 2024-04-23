import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { DateTime } from 'luxon';
import { TranscriptDetailsComponent } from './transcript-details.component';

describe('TranscriptDetailsComponent', () => {
  let component: TranscriptDetailsComponent;
  let fixture: ComponentFixture<TranscriptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptDetailsComponent, HttpClientTestingModule],
      providers: [
        LuxonDatePipe,
        DatePipe,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { transcriptionId: '1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptDetailsComponent);
    component = fixture.componentInstance;
    component.transcript = {
      transcriptionId: 12345,
      caseId: 1,
      hearingId: 1234,
      caseNumber: 'Swansea_case_1',
      courthouseId: 1,
      courthouse: 'Swansea',
      caseReportingRestrictions: [
        {
          hearing_id: 1,
          event_id: 123,
          event_name: 'Section 4(2) of the Contempt of Court Act 1981',
          event_text: 'event text',
          event_ts: '2023-08-21T09:00:00Z',
        },
      ],
      status: 'With transcriber',
      from: 'string',
      received: DateTime.fromISO('2024-04-18T14:11:11.781Z'),
      requestor: {
        userId: 1,
        fullName: 'Joe Bloggs',
      },
      requestorComments: 'This is a requestor comment',
      rejectionReason: 'This is a rejection reason',
      defendants: ['Dave Defendant'],
      judges: ['Judge Judy'],
      transcriptFileName: 'TS-23001.docx',
      hearingDate: DateTime.fromISO('2024-04-18'),
      urgency: 'Standard',
      requestType: 'Specified Times',
      isManual: false,
      transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00Z'),
      transcriptionEndTs: DateTime.fromISO('2023-06-26T13:00:00Z'),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
