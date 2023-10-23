import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Case, CaseFile, Courthouse, Hearing, SearchFormValues, Transcript } from '@darts-types/index';
import { ADVANCED_SEARCH_CASE_PATH, CaseService, GET_CASE_PATH, GET_COURTHOUSES_PATH } from './case.service';

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
      tra_id: 1,
      hea_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12',
      requested_by_name: 'Joe Bloggs',
      status: 'Complete',
    },
    {
      tra_id: 1,
      hea_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12',
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
        requested_on: t.requested_on + 'T00:00:00Z',
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
});
