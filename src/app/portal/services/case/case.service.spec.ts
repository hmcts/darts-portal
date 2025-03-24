import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  Annotations,
  AnnotationsData,
  Case,
  CaseData,
  CaseEvent,
  CaseEventData,
  CaseRetentionChange,
  CaseRetentionHistoryData,
  CaseSearchFormValues,
  CaseSearchRequest,
  CaseSearchResult,
  CaseSearchResultData,
  Hearing,
  HearingData,
  Transcript,
  TranscriptData,
} from '@portal-types/index';
import { MappingService } from '@services/mapping/mapping.service';
import { DateTime } from 'luxon';
import {
  ADVANCED_SEARCH_CASE_PATH,
  CaseService,
  GET_CASE_PATH,
  GET_CASE_RETENTION_HISTORY,
  GET_HEARINGS_PATH,
} from './case.service';

describe('CaseService', () => {
  let service: CaseService;
  let httpMock: HttpTestingController;

  const mockCaseData: CaseData = {
    case_id: 1,
    courthouse: 'Swansea',
    case_number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    retain_until: '2023-08-10T11:23:24Z',
    case_closed_date_time: '',
    reporting_restrictions: [],
    retain_until_date_time: '2023-07-10T11:23:24Z',
    retention_date_time_applied: '2023-06-10T11:23:24Z',
    retention_policy_applied: 'MANUAL',
    is_data_anonymised: true,
    data_anonymised_at: '2023-06-10T11:23:24Z',
  };

  const mockTranscriptData: TranscriptData[] = [
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Complete',
    },
  ];

  const multipleMockHearings: HearingData[] = [
    {
      id: 1,
      date: '2024-09-01',
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

  const multipleMockAnnotations: AnnotationsData[] = [
    {
      annotation_id: 1,
      hearing_id: 2,
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
  ];

  const multipleMockAnnotationsDocuments: AnnotationsData[] = [
    {
      annotation_id: 1,
      hearing_id: 2,
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
        {
          annotation_document_id: 2,
          file_name: 'AnnotationBeta.doc',
          file_type: 'DOC',
          uploaded_by: 'Mr Bob Sponge',
          uploaded_ts: '2023-12-15T14:00:00.000Z',
        },
      ],
    },
  ];

  const mockHearing: HearingData = {
    id: 2,
    date: '2024-09-01',
    judges: ['HHJ M. David KC'],
    courtroom: '9',
    transcript_count: 300,
  };

  const mockHistory: CaseRetentionHistoryData = {
    retention_last_changed_date: '2023-10-11T00:18:00Z',
    retention_date: '2030-09-15',
    amended_by: 'Judge Phil',
    retention_policy_applied: 'Permanent',
    comments: 'Permanent policy applied',
    status: 'PENDING',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CaseService, MappingService],
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

  it('#getCase', () => {
    const mockCaseId = 123;
    let result!: Case;

    service.getCase(mockCaseId).subscribe((caseData) => {
      result = caseData;
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCaseData);

    expect(result).toEqual({
      id: 1,
      courthouse: 'Swansea',
      number: 'CASE1001',
      defendants: ['Defendant Dave', 'Defendant Debbie'],
      judges: ['Judge Judy', 'Judge Jones'],
      prosecutors: ['Polly Prosecutor'],
      defenders: ['Derek Defender'],
      retainUntil: '2023-08-10T11:23:24Z',
      closedDateTime: undefined,
      reportingRestrictions: [],
      retainUntilDateTime: DateTime.fromISO('2023-07-10T11:23:24Z'),
      retentionDateTimeApplied: DateTime.fromISO('2023-06-10T11:23:24Z'),
      retentionPolicyApplied: 'MANUAL',
      isDataAnonymised: true,
      dataAnonymisedAt: DateTime.fromISO('2023-06-10T11:23:24Z'),
    });
  });

  it('#mapCaseDataToCase', () => {
    const data: CaseData = {
      ...mockCaseData,
      retain_until_date_time: undefined,
      retention_date_time_applied: undefined,
    };

    const result = service['mapCaseDataToCase'](data);

    expect(result).toEqual({
      id: 1,
      courthouse: 'Swansea',
      number: 'CASE1001',
      defendants: ['Defendant Dave', 'Defendant Debbie'],
      judges: ['Judge Judy', 'Judge Jones'],
      prosecutors: ['Polly Prosecutor'],
      defenders: ['Derek Defender'],
      retainUntil: '2023-08-10T11:23:24Z',
      closedDateTime: undefined,
      reportingRestrictions: [],
      retainUntilDateTime: undefined,
      retentionDateTimeApplied: undefined,
      retentionPolicyApplied: 'MANUAL',
      isDataAnonymised: true,
      dataAnonymisedAt: DateTime.fromISO('2023-06-10T11:23:24Z'),
    });
  });

  it('#mapCaseDataToCase should return undefined anonymised data if it does not exist', () => {
    const data: CaseData = {
      ...mockCaseData,
      retain_until_date_time: undefined,
      retention_date_time_applied: undefined,
      is_data_anonymised: false,
      data_anonymised_at: '',
    };

    const result = service['mapCaseDataToCase'](data);

    expect(result).toEqual({
      id: 1,
      courthouse: 'Swansea',
      number: 'CASE1001',
      defendants: ['Defendant Dave', 'Defendant Debbie'],
      judges: ['Judge Judy', 'Judge Jones'],
      prosecutors: ['Polly Prosecutor'],
      defenders: ['Derek Defender'],
      retainUntil: '2023-08-10T11:23:24Z',
      closedDateTime: undefined,
      reportingRestrictions: [],
      retainUntilDateTime: undefined,
      retentionDateTimeApplied: undefined,
      retentionPolicyApplied: 'MANUAL',
      isDataAnonymised: false,
      dataAnonymisedAt: undefined,
    });
  });

  it('#getCaseTranscripts', () => {
    const mockCaseId = 1;
    const mockTranscript: TranscriptData[] = mockTranscriptData;
    let result!: Transcript[];

    service.getCaseTranscripts(mockCaseId).subscribe((c) => {
      result = c;
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/transcripts`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTranscript);
    expect(result).toEqual([
      {
        id: 1,
        hearingId: 2,
        hearingDate: DateTime.fromISO('2023-10-12'),
        requestedByName: 'Joe Bloggs',
        requestedOn: DateTime.fromISO('2023-10-12T00:00:00Z'),
        status: 'Complete',
        type: 'Sentencing remarks',
      },
    ]);
  });

  it('#getHearingTranscripts', () => {
    const mockHearingId = 1;
    const mockTranscript: TranscriptData[] = mockTranscriptData;
    let result!: Transcript[];

    service.getHearingTranscripts(mockHearingId).subscribe((c) => {
      result = c;
    });

    const req = httpMock.expectOne(`${GET_HEARINGS_PATH}/${mockHearingId}/transcripts`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTranscript);
    expect(result).toEqual([
      {
        id: 1,
        hearingId: 2,
        hearingDate: DateTime.fromISO('2023-10-12'),
        requestedByName: 'Joe Bloggs',
        requestedOn: DateTime.fromISO('2023-10-12T00:00:00Z'),
        status: 'Complete',
        type: 'Sentencing remarks',
      },
    ]);
  });

  it('#getCaseHearings', () => {
    const mockCaseId = 123;
    const mockHearings: HearingData[] = multipleMockHearings;

    let hearingsResponse!: Hearing[];

    service.getCaseHearings(mockCaseId).subscribe((hearings) => {
      hearingsResponse = hearings;
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/hearings`);
    expect(req.request.method).toBe('GET');

    req.flush(mockHearings);

    expect(hearingsResponse).toEqual([
      {
        id: 1,
        date: DateTime.fromISO('2024-09-01'),
        judges: ['HHJ M. Hussain KC'],
        courtroom: '3',
        transcriptCount: 1,
      },
      {
        id: 2,
        date: DateTime.fromISO('2024-09-01'),
        judges: ['HHJ M. David KC'],
        courtroom: '9',
        transcriptCount: 300,
      },
    ]);
  });

  describe('#getCaseAnnotations', () => {
    it('should map an annotation for a single annotation document', () => {
      const mockCaseId = 123;
      const mockAnnotations: AnnotationsData[] = multipleMockAnnotations;

      let annotationsResponse!: Annotations[];

      service.getCaseAnnotations(mockCaseId).subscribe((annotations) => {
        annotationsResponse = annotations;
      });

      const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/annotations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAnnotations);

      expect(annotationsResponse).toEqual([
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2023-12-14'),
          annotationTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
          annotationText: 'A summary notes of this annotation...',
          annotationDocumentId: 1,
          fileName: 'Annotation.doc',
          fileType: 'DOC',
          uploadedBy: 'Mr User McUserFace',
          uploadedTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
        },
      ]);
    });

    it('should map an annotation for multiple annotation documents', () => {
      const mockCaseId = 123;
      const mockAnnotations: AnnotationsData[] = multipleMockAnnotationsDocuments;

      let annotationsResponse!: Annotations[];

      service.getCaseAnnotations(mockCaseId).subscribe((annotations) => {
        annotationsResponse = annotations;
      });

      const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/annotations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAnnotations);

      expect(annotationsResponse).toEqual([
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2023-12-14'),
          annotationTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
          annotationText: 'A summary notes of this annotation...',
          annotationDocumentId: 1,
          fileName: 'Annotation.doc',
          fileType: 'DOC',
          uploadedBy: 'Mr User McUserFace',
          uploadedTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
        },
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2023-12-14'),
          annotationTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
          annotationText: 'A summary notes of this annotation...',
          annotationDocumentId: 2,
          fileName: 'AnnotationBeta.doc',
          fileType: 'DOC',
          uploadedBy: 'Mr Bob Sponge',
          uploadedTs: DateTime.fromISO('2023-12-15T14:00:00.000Z'),
        },
      ]);
    });
  });

  describe('#searchCases', () => {
    it('for date ranges', fakeAsync(() => {
      const mockSearchForm: CaseSearchFormValues = {
        caseNumber: '123',
        courthouses: [
          {
            id: 1,
            displayName: 'Courthouse 1',
            courthouseName: 'Courthouse 1',
            code: 0,
            createdDateTime: DateTime.fromISO('2023-06-10T11:23:24Z'),
          },
          {
            id: 2,
            displayName: 'Courthouse 2',
            courthouseName: 'Courthouse 2',
            code: 0,
            createdDateTime: DateTime.fromISO('2023-06-10T11:23:24Z'),
          },
        ],
        courtroom: 'Room B',
        judgeName: 'Judge C',
        defendantName: 'Defendant D',
        hearingDate: {
          type: 'range',
          from: '01/01/2023',
          to: '31/12/2023',
          specific: '',
        },
        eventTextContains: 'Event Text',
      };
      const mockCases: Case[] = [];

      service.searchCases(mockSearchForm).subscribe((cases) => {
        expect(cases).toEqual(mockCases);
      });

      const expectedBody: CaseSearchRequest = {
        case_number: '123',
        courthouse_ids: [1, 2],
        courtroom: 'ROOM B',
        judge_name: 'Judge C',
        defendant_name: 'Defendant D',
        date_from: '2023-01-01',
        date_to: '2023-12-31',
        event_text_contains: 'Event Text',
      };

      const req = httpMock.expectOne((request) => {
        return request.url === ADVANCED_SEARCH_CASE_PATH && request.method === 'POST';
      });

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);

      req.flush(mockCases);
      tick();
    }));

    it('for specific date', () => {
      const mockSearchForm: CaseSearchFormValues = {
        caseNumber: '123',
        courthouses: [
          {
            id: 1,
            displayName: 'Courthouse 1',
            courthouseName: 'Courthouse 1',
            code: 0,
            createdDateTime: DateTime.fromISO('2023-06-10T11:23:24Z'),
          },
          {
            id: 2,
            displayName: 'Courthouse 2',
            courthouseName: 'Courthouse 2',
            code: 0,
            createdDateTime: DateTime.fromISO('2023-06-10T11:23:24Z'),
          },
        ],
        courtroom: 'Room B',
        judgeName: 'Judge C',
        defendantName: 'Defendant D',
        hearingDate: {
          type: 'specific',
          specific: '01/01/2023',
          from: '',
          to: '',
        },
        eventTextContains: 'Event Text',
      };
      const mockCases: Case[] = [];

      service.searchCases(mockSearchForm).subscribe((cases) => {
        expect(cases).toEqual(mockCases);
      });

      const expectedBody: CaseSearchRequest = {
        case_number: '123',
        courthouse_ids: [1, 2],
        courtroom: 'ROOM B',
        judge_name: 'Judge C',
        defendant_name: 'Defendant D',
        date_from: '2023-01-01',
        date_to: '2023-01-01',
        event_text_contains: 'Event Text',
      };

      const req = httpMock.expectOne((request) => {
        return request.url === ADVANCED_SEARCH_CASE_PATH && request.method === 'POST';
      });

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);

      req.flush(mockCases);
    });
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

  it('#getCaseRetentionHistory', () => {
    const mockCaseId = 123;
    const mock: CaseRetentionHistoryData[] = [mockHistory];

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

  it('#postCaseRetentionDateValidate', () => {
    const mockCaseRetentionChange: CaseRetentionChange = {
      case_id: 123,
      retention_date: '2033/01/01',
      is_permanent_retention: undefined,
      comments: 'These are my comments on the matter',
    };

    service.postCaseRetentionDateValidate(mockCaseRetentionChange).subscribe((c) => {
      expect(c).toEqual(mockCaseRetentionChange);
    });

    const req = httpMock.expectOne(`${GET_CASE_RETENTION_HISTORY}?validate_only=true`);
    expect(req.request.method).toBe('POST');

    req.flush(mockCaseRetentionChange);
  });

  describe('private method - mapCaseDataToCaseSearchResult', () => {
    it('should map user creation request', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).mapCaseDataToCaseSearchResult({
          case_id: 1,
          case_number: '1',
          courthouse: 'COURTHOUSE',
          defendants: ['DEFENDANT'],
          judges: ['JUDGE'],
          reporting_restriction: 'RESTRICTION',
          is_data_anonymised: true,
          data_anonymised_at: '2023-06-10T11:23:24Z',
        })
      ).toEqual({
        courthouse: 'COURTHOUSE',
        defendants: ['DEFENDANT'],
        hearings: undefined,
        id: 1,
        judges: ['JUDGE'],
        number: '1',
        reportingRestriction: 'RESTRICTION',
        courtrooms: [],
        isDataAnonymised: true,
        dataAnonymisedAt: DateTime.fromISO('2023-06-10T11:23:24Z'),
      });
    });

    it('should have undefined anonymised data if empty', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).mapCaseDataToCaseSearchResult({
          case_id: 1,
          case_number: '1',
          courthouse: 'COURTHOUSE',
          defendants: ['DEFENDANT'],
          judges: ['JUDGE'],
          reporting_restriction: 'RESTRICTION',
          is_data_anonymised: false,
          data_anonymised_at: '',
        })
      ).toEqual({
        courthouse: 'COURTHOUSE',
        defendants: ['DEFENDANT'],
        hearings: undefined,
        id: 1,
        judges: ['JUDGE'],
        number: '1',
        reportingRestriction: 'RESTRICTION',
        courtrooms: [],
        isDataAnonymised: false,
        dataAnonymisedAt: undefined,
      });
    });

    describe('maps courtrooms', () => {
      let data: CaseSearchResultData;
      beforeEach(() => {
        data = {
          case_id: 1,
          case_number: '1',
          courthouse: 'COURTHOUSE',
          defendants: ['DEFENDANT'],
          judges: ['JUDGE'],
          reporting_restriction: 'RESTRICTION',
          hearings: [
            {
              id: 1,
              date: DateTime.fromFormat('2024-06-09', 'YYYY-MM-DD'),
              courtroom: '1',
              judges: [],
              transcriptCount: 0,
            },
          ],
        };
      });

      it('single courtroom', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: CaseSearchResult = (service as any).mapCaseDataToCaseSearchResult(data);
        expect(mapped.courtrooms).toEqual(['1']);
      });

      it('multiple identical courtrooms', () => {
        data.hearings?.push({
          id: 2,
          date: DateTime.fromFormat('2024-06-10', 'YYYY-MM-DD'),
          courtroom: '1',
          judges: [],
          transcriptCount: 0,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: CaseSearchResult = (service as any).mapCaseDataToCaseSearchResult(data);
        expect(mapped.courtrooms).toEqual(['1']);
      });

      it('multiple different courtrooms', () => {
        data.hearings?.push({
          id: 2,
          date: DateTime.fromFormat('2024-06-10', 'YYYY-MM-DD'),
          courtroom: '2',
          judges: [],
          transcriptCount: 0,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: CaseSearchResult = (service as any).mapCaseDataToCaseSearchResult(data);
        expect(mapped.courtrooms).toEqual(['1', '2']);
      });
    });
  });

  describe('#mapTranscriptDataToTranscript', () => {
    it('should map transcript data to transcript', () => {
      const data: TranscriptData[] = [
        {
          transcription_id: 1,
          hearing_id: 2,
          hearing_date: '2023-10-12',
          type: 'Sentencing remarks',
          requested_on: '2023-10-12T00:00:00Z',
          requested_by_name: 'Joe Bloggs',
          status: 'Complete',
        },
      ];
      expect(service['mapTranscriptDataToTranscript'](data)).toEqual([
        {
          id: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2023-10-12'),
          type: 'Sentencing remarks',
          requestedOn: DateTime.fromISO('2023-10-12T00:00:00Z'),
          status: 'Complete',
          requestedByName: 'Joe Bloggs',
        },
      ]);
    });

    it('should map Approved status to With Transcriber', () => {
      const data = [{ status: 'Approved' }];
      const mappedData = service['mapTranscriptDataToTranscript'](data as TranscriptData[]);
      expect(mappedData[0].status).toEqual('With Transcriber');
    });
  });

  it('#getCaseEvents', () => {
    const mockCaseId = 123;
    const mockEvents: CaseEventData[] = [
      {
        id: 1,
        hearing_id: 2,
        hearing_date: '2023-10-12',
        timestamp: '2023-10-12T00:00:00Z',
        name: 'Event 1',
        text: 'Event 1 description',
      },
      {
        id: 2,
        hearing_id: 2,
        hearing_date: '2023-10-12',
        timestamp: '2023-10-12T00:00:00Z',
        name: 'Event 2',
        text: 'Event 2 description',
      },
    ];

    let eventsResponse!: CaseEvent[];

    service.getCaseEvents(mockCaseId).subscribe((events) => {
      eventsResponse = events;
    });

    const req = httpMock.expectOne(`${GET_CASE_PATH}/${mockCaseId}/events`);
    expect(req.request.method).toBe('GET');

    req.flush(mockEvents);

    expect(eventsResponse).toEqual([
      {
        id: 1,
        hearingId: 2,
        hearingDate: DateTime.fromISO('2023-10-12'),
        timestamp: DateTime.fromISO('2023-10-12T00:00:00Z'),
        name: 'Event 1',
        text: 'Event 1 description',
      },
      {
        id: 2,
        hearingId: 2,
        hearingDate: DateTime.fromISO('2023-10-12'),
        timestamp: DateTime.fromISO('2023-10-12T00:00:00Z'),
        name: 'Event 2',
        text: 'Event 2 description',
      },
    ]);
  });
});
