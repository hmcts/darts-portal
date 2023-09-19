import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CaseData } from 'src/app/types/case';
import { CaseFile } from 'src/app/types/case-file';
import { CourthouseData } from 'src/app/types/courthouse';
import { HearingData } from 'src/app/types/hearing';
import { SearchFormValues } from 'src/app/types/search-form.interface';
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

  const multipleMockHearings: HearingData[] = [
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

  const mockHearing: HearingData = {
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
    const mockCourthouses: CourthouseData[] = [];

    service.getCourthouses().subscribe((courthouses) => {
      expect(courthouses).toEqual(mockCourthouses);
    });

    const req = httpMock.expectOne(GET_COURTHOUSES_PATH);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourthouses);
  });

  it('#getCase', () => {
    const mockCaseId = 123;
    const mockCase: CaseData = mockCaseFile;

    service.getCase(mockCaseId).subscribe((c) => {
      expect(c).toEqual(mockCase);
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCase);
  });

  it('#getCaseHearings', () => {
    const mockCaseId = 123;
    const mockHearings: HearingData[] = multipleMockHearings;

    service.getCaseHearings(mockCaseId).subscribe((hearings) => {
      expect(hearings).toEqual(mockHearings);
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/hearings`);
    expect(req.request.method).toBe('GET');

    req.flush(mockHearings);
  });

  it('#getCasesAdvanced', () => {
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
    const mockCases: CaseData[] = [];

    service.getCasesAdvanced(mockSearchForm).subscribe((cases) => {
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
    const mockHearings: HearingData[] = [mockHearing];

    service.getHearingById(mockCaseId, mockHearingId).subscribe((hearing) => {
      expect(hearing).toBeDefined();
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/hearings`);
    expect(req.request.method).toBe('GET');

    req.flush(mockHearings);
  });
});
