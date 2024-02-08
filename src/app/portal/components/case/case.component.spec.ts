import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AnnotationsData, Case, Hearing, TranscriptData } from '@portal-types/index';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';
import { CaseService } from 'src/app/portal/services/case/case.service';
import { CaseComponent } from './case.component';

describe('CaseComponent', () => {
  let component: CaseComponent;
  let fixture: ComponentFixture<CaseComponent>;

  const mockCaseFile: Observable<Case> = of({
    id: 1,
    courthouse: 'Swansea',
    number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    retain_until: '2023-08-10T11:23:24.858Z',
  });

  const mockSingleCaseTwoHearings: Observable<Hearing[]> = of([
    {
      id: 1,
      date: DateTime.fromISO('2023-09-01'),
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcriptCount: 1,
    },
  ]);

  const mockTranscript: Observable<TranscriptData[]> = of([
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Rejected',
    },
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Requested',
    },
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Complete',
    },
  ]);

  const mockAnnotation: Observable<AnnotationsData[]> = of([
    {
      annotation_id: 1,
      hearing_id: 123,
      hearing_date: '2023-12-14',
      annotation_ts: '2023-12-15T12:00:00.000Z',
      annotation_text: 'A summary notes of this annotation...',
      annotation_documents: [
        {
          annotation_document_id: 1,
          file_name: 'Annotation.doc',
          file_type: 'DOC',
          uploaded_by: 'Mr User McUserFace',
          uploaded_ts: '2023-12-15T12:00:00.000Z',
        },
      ],
    },
  ]);

  const caseServiceMock = {
    getCase: jest.fn(),
    getCaseHearings: jest.fn(),
    getCaseTranscripts: jest.fn(),
    getCaseAnnotations: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      params: {
        caseId: 1,
      },
      queryParams: { tab: 'Transcripts' },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CaseService, useValue: caseServiceMock },
        { provide: DatePipe },
      ],
    });

    jest.spyOn(caseServiceMock, 'getCase').mockReturnValue(mockCaseFile);
    jest.spyOn(caseServiceMock, 'getCaseHearings').mockReturnValue(mockSingleCaseTwoHearings);
    jest.spyOn(caseServiceMock, 'getCaseTranscripts').mockReturnValue(mockTranscript);
    jest.spyOn(caseServiceMock, 'getCaseAnnotations').mockReturnValue(mockAnnotation);

    fixture = TestBed.createComponent(CaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('caseId should be set', () => {
    expect(component.caseId).toEqual(1);
  });

  it('caseFile$ should be set', () => {
    expect(component.caseFile$).toEqual(mockCaseFile);
  });

  it('hearings$ should be set', () => {
    expect(component.hearings$).toEqual(mockSingleCaseTwoHearings);
  });
});
