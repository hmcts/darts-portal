import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CaseRetentionHistory } from '@darts-types/case-retention-history.interface';
import { Case, CaseFile, Courthouse, Hearing, SearchFormValues, Transcript } from '@darts-types/index';
import {
  ADVANCED_SEARCH_CASE_PATH,
  CaseService,
  GET_CASE_PATH,
  GET_CASE_RETENTION_HISTORY,
  GET_COURTHOUSES_PATH,
  GET_HEARINGS_PATH,
} from './case.service';
import { CaseRetentionChange } from '@darts-types/case-retention-change.interface';

describe('CaseService', () => {
  let service: CaseService;
  let httpMock: HttpTestingController;

  const mockCaseFile: CaseFile = {
    case_id: 1,
    courthouse: 'Swansea',
    case_number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    retain_until: '2023-08-10T11:23:24.858Z',
  };

  const mockTranscripts: Transcript[] = [
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Complete',
    },
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Approved',
    },
  ];

  const multipleMockHearings: Hearing[] = [
    {
      id: 1,
      date: '2023-09-01',
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcript_count: 1,
    },
    {
      id: 2,
      date: '2024-09-01',
      judges: ['HHJ M. David KC'],
      courtroom: '9',
      transcript_count: 300,
    },
  ];

  const mockHearing: Hearing = {
    id: 2,
    date: '2024-09-01',
    judges: ['HHJ M. David KC'],
    courtroom: '9',
    transcript_count: 300,
  };

  const mockHistory: CaseRetentionHistory = {
    retention_last_changed_date: '2023-10-11T00:18:00Z',
    retention_date: '2030-09-15',
    amended_by: 'Judge Phil',
    retention_policy_applied: 'Permanent',
    comments: 'Permanent policy applied',
    status: 'PENDING',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CaseService],
    });

    service = TestBed.inject(CaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCourthouses', () => {
    const mockCourthouses: Courthouse[] = [];

    service.getCourthouses().subscribe((courthouses) => {
      expect(courthouses).toEqual(mockCourthouses);
    });

    const req = httpMock.expectOne(GET_COURTHOUSES_PATH);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourthouses);
  });

  it('#getCase', () => {
    const mockCaseId = 123;
    const mockCase: Case = mockCaseFile;

    service.getCase(mockCaseId).subscribe((c) => {
      expect(c).toEqual(mockCase);
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCase);
  });

  it('#getAllCaseTranscripts', () => {
    const mockCaseId = 1;
    const mockTranscript: Transcript[] = mockTranscripts;
    let result!: Transcript[];

    service.getAllCaseTranscripts(mockCaseId).subscribe((c) => {
      result = c;
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/transcripts`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTranscript);
    expect(result).toEqual(
      mockTranscripts.map((t) => ({
        ...t,
        date: t.hearing_date + 'T00:00:00Z',
      }))
    );
  });

  it('#getAllHearingTranscripts', () => {
    const mockHearingId = 1;
    const mockTranscript: Transcript[] = mockTranscripts;
    let result!: Transcript[];

    service.getAllHearingTranscripts(mockHearingId).subscribe((c) => {
      result = c;
    });

    const req = httpMock.expectOne(`${GET_HEARINGS_PATH}/${mockHearingId}/transcripts`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTranscript);
    expect(result).toEqual(
      mockTranscripts.map((t) => ({
        ...t,
        date: t.hearing_date + 'T00:00:00Z',
      }))
    );
  });

  it('#getCaseHearings', () => {
    const mockCaseId = 123;
    const mockHearings: Hearing[] = multipleMockHearings;

    let hearingsResponse!: Hearing[];

    service.getCaseHearings(mockCaseId).subscribe((hearings) => {
      hearingsResponse = hearings;
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/hearings`);
    expect(req.request.method).toBe('GET');

    req.flush(mockHearings);

    expect(hearingsResponse).toEqual(mockHearings.map((h) => ({ ...h, date: h.date + 'T00:00:00Z' })));
  });

  it('#searchCases', () => {
    const mockSearchForm: SearchFormValues = {
      case_number: '123',
      courthouse: 'Court A',
      courtroom: 'Room B',
      judge_name: 'Judge C',
      defendant_name: 'Defendant D',
      date_from: '01/01/2023',
      date_to: '31/12/2023',
      event_text_contains: 'Event Text',
    };
    const mockCases: Case[] = [];

    service.searchCases(mockSearchForm).subscribe((cases) => {
      expect(cases).toEqual(mockCases);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === ADVANCED_SEARCH_CASE_PATH &&
        request.method === 'GET' &&
        request.params.get('case_number') === '123' &&
        request.params.get('courthouse') === 'Court A' &&
        request.params.get('courtroom') === 'Room B' &&
        request.params.get('judge_name') === 'Judge C' &&
        request.params.get('defendant_name') === 'Defendant D' &&
        request.params.get('date_from') === '2023-01-01' &&
        request.params.get('date_to') === '2023-12-31' &&
        request.params.get('event_text_contains') === 'Event Text'
      );
    });

    expect(req.request.method).toBe('GET');

    req.flush(mockCases);
  });

  it('#getHearingById', () => {
    const mockCaseId = 123;
    const mockHearingId = 456;
    const mockHearings: Hearing[] = [mockHearing];

    service.getHearingById(mockCaseId, mockHearingId).subscribe((hearing) => {
      expect(hearing).toBeDefined();
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/hearings`);
    expect(req.request.method).toBe('GET');

    req.flush(mockHearings);
  });

  it('#getCaseRetentionHistory', () => {
    const mockCaseId = 123;
    const mock: CaseRetentionHistory[] = [mockHistory];

    service.getCaseRetentionHistory(mockCaseId).subscribe((history) => {
      expect(history).toBeDefined();
    });

    const req = httpMock.expectOne(
      (req) => req.url === GET_CASE_RETENTION_HISTORY && req.params.get('case_id') === mockCaseId.toString()
    );

    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('#getCaseRetentionHistory should return an empty array on error', () => {
    const caseId = 123;

    service.getCaseRetentionHistory(caseId).subscribe({
      next: (data) => expect(data).toEqual([]),
      error: () => fail('Expected a successful response, but an error was received'),
    });

    const req = httpMock.expectOne(`${GET_CASE_RETENTION_HISTORY}?case_id=${caseId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('#postCaseRetentionChange', () => {
    const mockCaseRetentionChange: CaseRetentionChange = {
      case_id: 123,
      retention_date: '2033/01/01',
      is_permanent_retention: undefined,
      comments: 'These are my comments on the matter',
    };

    service.postCaseRetentionChange(mockCaseRetentionChange).subscribe((c) => {
      expect(c).toEqual(mockCaseRetentionChange);
    });

    const req = httpMock.expectOne(`${GET_CASE_RETENTION_HISTORY}`);
    expect(req.request.method).toBe('POST');

    req.flush(mockCaseRetentionChange);
  });
});
