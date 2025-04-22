import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { FileHideOrDeleteFormValues } from '@admin-types/hidden-reasons/file-hide-or-delete-form-values';
import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { HiddenReasonData } from '@admin-types/hidden-reasons/hidden-reason-data.interface';
import {
  Transcription,
  TranscriptionDocumentForDeletionData,
  TranscriptionDocumentSearchResult,
  TranscriptionDocumentSearchResultData,
  TranscriptionSearchFormValues,
  TranscriptionStatus,
} from '@admin-types/index';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { TranscriptionAdminDetailsData } from '@admin-types/transcription/transcription-details-data.interface';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptStatus } from '@portal-types/index';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { TranscriptionAdminService } from './transcription-admin.service';

const MOCK_STATUSES: TranscriptionStatus[] = [
  {
    id: 1,
    type: 'Requested',
    displayName: 'Requested',
  },
  {
    id: 2,
    type: 'Awaiting Authorisation',
    displayName: 'Awaiting Authorisation',
  },
  {
    id: 3,
    type: 'Approved',
    displayName: 'Approved',
  },
  {
    id: 4,
    type: 'Rejected',
    displayName: 'Rejected',
  },
  {
    id: 5,
    type: 'With Transcriber',
    displayName: 'With Transcriber',
  },
  {
    id: 6,
    type: 'Complete',
    displayName: 'Complete',
  },
  {
    id: 7,
    type: 'Closed',
    displayName: 'Closed',
  },
];

const emptySearchRequestBody = {
  transcription_id: null,
  case_number: null,
  courthouse_display_name: null,
  hearing_date: null,
  requested_at_from: null,
  requested_at_to: null,
  requested_by: null,
  is_manual_transcription: null,
};

describe('TranscriptionAdminService', () => {
  let service: TranscriptionAdminService;
  let httpMock: HttpTestingController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TranscriptionAdminService,
        LuxonDatePipe,
        DatePipe,
        { provide: UserService, useValue: { isAdmin: jest.fn().mockReturnValue(true) } },
      ],
    });
    service = TestBed.inject(TranscriptionAdminService);
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('search', () => {
    it('should send a POST request to search transcriptions', () => {
      const formValues = {
        requestId: '123',
        caseId: '456',
        courthouse: 'Test Courthouse',
        hearingDate: '01/01/2022',
        requestedBy: 'Test Requester',
        requestedDate: { from: '01/01/2022', to: '31/01/2022' },
        requestMethod: 'manual',
      };

      const expectedBody = {
        transcription_id: 123,
        case_number: '456',
        courthouse_display_name: 'TEST COURTHOUSE',
        hearing_date: '2022-01-01',
        requested_by: 'Test Requester',
        requested_at_from: '2022-01-01',
        requested_at_to: '2022-01-31',
        is_manual_transcription: true,
      };

      const mockResponse = [
        {
          transcription_id: 1,
          case_number: '123',
          courthouse_id: 1,
          hearing_date: '2022-01-01T00:00:00Z',
          requested_at: '2022-01-01T00:00:00Z',
          transcription_status_id: 1,
          is_manual_transcription: true,
        },
      ];

      let mappedResult: Transcription[] = [];

      service.search(formValues).subscribe((transcriptions) => {
        mappedResult = transcriptions;
      });

      const req = httpMock.expectOne('api/admin/transcriptions/search');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
      req.flush(mockResponse);

      expect(mappedResult).toEqual([
        {
          id: 1,
          caseNumber: '123',
          courthouse: { id: 1 },
          hearingDate: DateTime.fromISO('2022-01-01T00:00:00Z'),
          requestedAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          status: { id: 1 },
          isManual: true,
        },
      ]);
    });

    it('should send a POST request to search transcriptions with empty values', () => {
      const formValues = {
        requestId: '',
        caseId: '',
        courthouse: '',
        hearingDate: '',
        owner: '',
        requestedBy: '',
        requestedDate: { from: '', to: '' },
        requestMethod: '',
      };

      service.search(formValues).subscribe();

      const req = httpMock.expectOne('api/admin/transcriptions/search');
      expect(req.request.body).toEqual(emptySearchRequestBody);
    });

    it('map specific date to requested_at_from and requested_at_to', () => {
      const formValues = {
        requestedDate: { type: 'specific', specific: '01/01/2022', from: '', to: '' },
      };

      const expectedBody = {
        ...emptySearchRequestBody,
        requested_at_from: '2022-01-01',
        requested_at_to: '2022-01-01',
      };

      service.search(formValues).subscribe();

      const req = httpMock.expectOne('api/admin/transcriptions/search');
      expect(req.request.body).toEqual(expectedBody);
    });

    it('map from date to requested_at_from', () => {
      const formValues = {
        requestedDate: { type: 'from', specific: '', from: '01/01/2022', to: '' },
      };

      const expectedBody = {
        ...emptySearchRequestBody,
        requested_at_from: '2022-01-01',
      };

      service.search(formValues).subscribe();

      const req = httpMock.expectOne('api/admin/transcriptions/search');
      expect(req.request.body).toEqual(expectedBody);
    });
  });

  it('should send a GET request to fetch transcription statuses', () => {
    const mockResponse = [
      { id: 1, type: 'status1', display_name: 'Status 1' },
      { id: 2, type: 'status2', display_name: 'Status 2' },
    ];

    let result: TranscriptionStatus[] = [];

    service.getTranscriptionStatuses().subscribe((statuses) => (result = statuses));

    const req = httpMock.expectOne('api/admin/transcription-status');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual([
      { id: 1, type: 'status1', displayName: 'Status 1' },
      { id: 2, type: 'status2', displayName: 'Status 2' },
    ]);
  });

  it('should fetch transcription details and correctly map the response', () => {
    const transcriptId = 123;
    const mockData = {
      case_id: 1,
      case_reporting_restrictions: [
        {
          hearing_id: 1,
          event_id: 123,
          event_name: 'Section 4(2) of the Contempt of Court Act 1981',
          event_text: '',
          event_ts: '2023-08-07T09:00:00Z',
        },
      ],
      case_number: 'C20220620001',
      courthouse: 'Swansea',
      courtroom: 'Courtroom 1',
      courthouse_id: 1,
      status: 'With Transcriber',
      from: 'MoJ CH Swansea',
      received: '2023-11-17T12:53:07.468Z',
      requestor_comments: 'Please expedite my request',
      rejection_reason: 'This request will take longer to transcribe within the urgency level you require.',
      defendants: ['Defendant Dave', 'Defendant Bob'],
      judges: ['HHJ M. Hussain KC', 'Ray Bob'],
      transcript_file_name: 'C20220620001_0.docx',
      hearing_date: '2023-11-08',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Standard',
        priority_order: 1,
      },
      request_type: 'Specified Times',
      request_id: 123456789,
      transcription_id: 12345,
      transcription_start_ts: '2023-06-26T13:00:00Z',
      transcription_end_ts: '2023-06-26T16:00:00Z',
      transcription_object_id: 1,
      is_manual: true,
      hearing_id: 1,
      requestor: {
        user_id: 1,
        user_full_name: 'Eric Bristow',
      },
    } as TranscriptionAdminDetailsData;

    const expectedData = {
      caseReportingRestrictions: [
        {
          hearing_id: 1,
          event_id: 123,
          event_name: 'Section 4(2) of the Contempt of Court Act 1981',
          event_text: '',
          event_ts: '2023-08-07T09:00:00Z',
        },
      ],
      caseId: 1,
      caseNumber: 'C20220620001',
      courthouse: 'Swansea',
      courtroom: 'Courtroom 1',
      courthouseId: 1,
      status: 'With Transcriber',
      from: 'Eric Bristow',
      received: DateTime.fromISO('2023-11-17T12:53:07.468Z'),
      requestorComments: 'Please expedite my request',
      rejectionReason: 'This request will take longer to transcribe within the urgency level you require.',
      defendants: ['Defendant Dave', 'Defendant Bob'],
      judges: ['HHJ M. Hussain KC', 'Ray Bob'],
      transcriptFileName: 'C20220620001_0.docx',
      hearingDate: DateTime.fromISO('2023-11-08T00:00:00.000Z'),
      urgency: {
        transcription_urgency_id: 1,
        description: 'Standard',
        priority_order: 1,
      },
      requestType: 'Specified Times',
      transcriptionId: 12345,
      transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00.000Z'),
      transcriptionEndTs: DateTime.fromISO('2023-06-26T16:00:00.000Z'),
      transcriptionObjectId: 1,
      isManual: true,
      hearingId: 1,
      requestor: {
        fullName: 'Eric Bristow',
        userId: 1,
      },
    } as unknown as TranscriptionAdminDetails;

    let result: TranscriptionAdminDetails | null = null;
    service.getTranscriptionDetails(transcriptId).subscribe((t) => {
      result = t;
    });

    const req = httpMock.expectOne(`api/transcriptions/${transcriptId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(result).toEqual(expectedData);
  });

  it('should find the latest transcription workflow actor', () => {
    const transcriptionId = 456;
    const mockWorkflows = [
      {
        workflowActor: 1,
        statusId: 0,
        comments: [
          {
            comment: 'string',
            commentedAt: DateTime.fromISO('2034-01-01T00:00:00Z'),
            authorid: 0,
          },
        ],
        workflowTimestamp: DateTime.fromISO('2024-01-01T00:00:00Z'),
      },
      {
        workflowActor: 2,
        statusId: 0,
        comments: [
          {
            comment: 'string',
            commentedAt: DateTime.fromISO('2034-01-01T00:00:00Z'),
            authorId: 0,
          },
        ],
        workflowTimestamp: DateTime.fromISO('2034-01-01T00:00:00Z'),
      },
    ] as TranscriptionWorkflow[];

    jest.spyOn(service, 'getTranscriptionWorkflows').mockReturnValue(of(mockWorkflows));

    let id;
    service.getLatestTranscriptionWorkflowActor(transcriptionId, false).subscribe((actorId) => {
      id = actorId;
    });

    expect(id).toBe(2);
  });

  it('should fetch roles and return the transcriber role ID', () => {
    const mockRoles = [
      { id: 1, role_name: 'ADMIN' },
      { id: 2, role_name: 'TRANSCRIBER' },
    ];
    const GET_SECURITY_ROLES_PATH = 'api/admin/security-roles';

    let roleId;
    service.getTranscriberRoleId().subscribe((id) => {
      roleId = id;
    });

    const req = httpMock.expectOne(GET_SECURITY_ROLES_PATH);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);

    expect(roleId).toBe(2);
  });

  it('should fetch security groups if role ID is found', () => {
    const mockRoleId = 1;
    const courthouseId = 456;
    const mockSecurityGroups = [
      {
        id: 1,
        name: 'Judiciary',
        description: 'Dummy description 1',
      },
      {
        id: 2,
        name: 'Opus Transcribers',
        description: 'Dummy description 2',
      },
    ];
    jest.spyOn(service, 'getTranscriberRoleId').mockReturnValue(of(mockRoleId));

    let groups;
    service.getTranscriptionSecurityGroups(courthouseId).subscribe((g) => {
      groups = g;
    });

    const req = httpMock.expectOne((request) => request.url.includes('/api/admin/security-groups'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('role_id')).toBe(String(mockRoleId));
    expect(req.request.params.get('courthouse_id')).toBe(String(courthouseId));
    req.flush(mockSecurityGroups);

    expect(groups).toEqual(mockSecurityGroups);
  });

  it('should fetch transcription workflows and map them correctly', () => {
    const mockWorkflows = [{ workflow_actor: 1, status_id: 2, workflow_ts: '2021-01-01T00:00:00Z', comments: [] }];
    const transcriptionId = 789;
    const current = true;

    let wflows: TranscriptionWorkflow[] = [];
    service.getTranscriptionWorkflows(transcriptionId, current).subscribe((workflows) => {
      wflows = workflows;
    });

    const req = httpMock.expectOne((request) => request.url.includes('api/admin/transcription-workflows'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('is_current')).toBe(String(current));
    expect(req.request.params.get('transcription_id')).toBe(String(transcriptionId));
    req.flush(mockWorkflows);

    expect(wflows[0].workflowActor).toBe(1);
    expect(wflows[0].statusId).toBe(2);
    expect(wflows[0].workflowTimestamp.toISO({ includeOffset: false })).toBe('2021-01-01T00:00:00.000');
  });

  it('should return correct status and associated data based on transcript details', () => {
    const transcript = {
      transcriptionId: 1,
      isManual: true,
      status: 'Approved',
      assignedTo: {
        userId: 1,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
      },
      assignedGroups: [
        { id: 1, displayName: 'Group One' },
        { id: 2, displayName: 'Group Two' },
      ],
    } as unknown as TranscriptionAdminDetails;

    const result = service.getCurrentStatusFromTranscript(transcript);

    expect(result.Status?.value).toBe('Approved');
    expect(result.Status?.action?.text).toBe('Change status');
    expect(result.Status?.action?.url).toBe('/admin/transcripts/1/change-status');
    expect(result.Status?.action?.queryParams).toEqual({ status: 'Approved', manual: true });
    if (typeof result['Assigned to'][0] !== 'string') {
      expect(result['Assigned to'][0].href).toBe('/admin/users/1');
      expect(result['Assigned to'][0].value).toBe('John Doe');
      expect(result['Assigned to'][0].caption).toBe('john.doe@example.com');
    }
    expect(result['Associated groups']).toEqual([
      { href: '/admin/groups/1', value: 'Group One' },
      { href: '/admin/groups/2', value: 'Group Two' },
    ]);
  });

  it('should return correct status and associated data based on transcript details for super user', () => {
    userService.isAdmin.mockReturnValueOnce(false);

    const transcript = {
      transcriptionId: 1,
      isManual: true,
      status: 'Approved',
      assignedTo: {
        userId: 1,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
      },
      assignedGroups: [
        { id: 1, displayName: 'Group One' },
        { id: 2, displayName: 'Group Two' },
      ],
    } as unknown as TranscriptionAdminDetails;

    const result = service.getCurrentStatusFromTranscript(transcript);

    expect(result.Status?.value).toBe('Approved');
    expect(result.Status?.action?.text).toBe('Change status');
    expect(result.Status?.action?.url).toBe('/admin/transcripts/1/change-status');
    expect(result.Status?.action?.queryParams).toEqual({ status: 'Approved', manual: true });
    if (typeof result['Assigned to'][0] !== 'string') {
      expect(result['Assigned to'][0].href).toBe('/admin/users/1');
      expect(result['Assigned to'][0].value).toBe('John Doe');
      expect(result['Assigned to'][0].caption).toBe('john.doe@example.com');
    }
    expect(result['Associated groups']).toEqual(['Group One', 'Group Two']);
  });

  it('return no associated groups for "Awaiting Authorisation" status', () => {
    const transcript = {
      transcriptionId: 1,
      isManual: true,
      status: 'Awaiting Authorisation',
      assignedTo: {
        userId: 1,
        fullName: 'John Doe',
        email: 'email@email.com',
      },
      assignedGroups: [
        { id: 1, displayName: 'Group One' },
        { id: 2, displayName: 'Group Two' },
      ],
    } as unknown as TranscriptionAdminDetails;

    const result = service.getCurrentStatusFromTranscript(transcript);

    expect(result.Status?.value).toBe('Awaiting Authorisation');
    expect(result.Status?.action?.text).toBe('Change status');
    expect(result.Status?.action?.url).toBe('/admin/transcripts/1/change-status');

    expect(result['Associated groups']).toBeFalsy();
  });

  it('return no associated groups for "Requested" status', () => {
    const transcript = {
      transcriptionId: 1,
      isManual: true,
      status: 'Requested',
      assignedTo: {
        userId: 1,
        fullName: 'John Doe',
        email: 'a@a.com',
      },
      assignedGroups: [
        { id: 1, displayName: 'Group One' },
        { id: 2, displayName: 'Group Two' },
      ],
    } as unknown as TranscriptionAdminDetails;

    const result = service.getCurrentStatusFromTranscript(transcript);

    expect(result.Status?.value).toBe('Requested');
    expect(result.Status?.action?.text).toBe('Change status');
    expect(result.Status?.action?.url).toBe('/admin/transcripts/1/change-status');

    expect(result['Associated groups']).toBeFalsy();
  });

  it('should return correct status and associated data based on empty/null transcript details', () => {
    const transcript = {
      transcriptionId: 1,
      isManual: true,
      status: 'Complete',
      assignedTo: {},
      assignedGroups: [],
    } as unknown as TranscriptionAdminDetails;

    const result = service.getCurrentStatusFromTranscript(transcript);

    expect(result.Status?.value).toBe('Complete');
    expect(result.Status?.action).toBe(undefined);
    expect(result['Assigned to']).toBe('Unassigned');
    expect(result['Associated groups']).toEqual(null);
  });

  it('should format transcription details correctly', () => {
    const transcript = {
      hearingDate: DateTime.fromISO('2024-01-01T00:00:00Z'),
      requestType: 'Type1',
      isManual: true,
      transcriptionId: 123,
      urgency: { description: 'High' },
      transcriptionStartTs: DateTime.fromISO('2024-03-03T09:00:00Z'),
      transcriptionEndTs: DateTime.fromISO('2024-03-03T10:00:00Z'),
      requestor: { userId: 1, fullName: 'John Doe', email: 'john@example.com' },
      received: DateTime.fromISO('2024-01-01T13:30:00Z'),
      approved: DateTime.fromISO('2024-01-01T15:30:00Z'),
      requestorComments: 'Need ASAP',
    } as unknown as TranscriptionAdminDetails;

    const details = service.getRequestDetailsFromTranscript(transcript);

    expect(details).toEqual({
      'Hearing date': '01 Jan 2024',
      'Request type': 'Type1',
      'Request method': 'Manual',
      'Request ID': 123,
      Urgency: 'High',
      'Audio for transcript': 'Start time 09:00:00 - End time 10:00:00',
      'Requested by': [{ href: '/admin/users/1', value: 'John Doe', caption: 'john@example.com' }],
      Received: '01 Jan 2024 13:30:00',
      'Approved on': '01 Jan 2024 15:30:00',
      Instructions: 'Need ASAP',
      'Judge approval': 'Yes',
    });
  });

  it('should include legacy comments if it exists', () => {
    const transcript = {
      hearingDate: DateTime.fromISO('2024-01-01T00:00:00Z'),
      requestType: 'Type1',
      isManual: true,
      transcriptionId: 123,
      urgency: { description: 'High' },
      transcriptionStartTs: DateTime.fromISO('2024-03-03T09:00:00Z'),
      transcriptionEndTs: DateTime.fromISO('2024-03-03T10:00:00Z'),
      requestor: { userId: 1, fullName: 'John Doe', email: 'john@example.com' },
      received: DateTime.fromISO('2024-01-01T13:30:00Z'),
      requestorComments: 'Need ASAP',
      legacyComments: ['Legacy comment 1', 'Legacy comment 2'],
    } as unknown as TranscriptionAdminDetails;

    const details = service.getRequestDetailsFromTranscript(transcript);

    expect(details).toEqual({
      'Hearing date': '01 Jan 2024',
      'Request type': 'Type1',
      'Request method': 'Manual',
      'Request ID': 123,
      Urgency: 'High',
      'Audio for transcript': 'Start time 09:00:00 - End time 10:00:00',
      'Requested by': [{ href: '/admin/users/1', value: 'John Doe', caption: 'john@example.com' }],
      Received: '01 Jan 2024 13:30:00',
      Instructions: 'Need ASAP',
      'Judge approval': 'Yes',
      'Migrated legacy data comments': ['Legacy comment 1', 'Legacy comment 2'],
    });
  });

  describe('updateTranscriptionStatus', () => {
    it('send patch request with correct body', () => {
      const transcriptionId = 1;
      const statusId = 2;
      const comment = 'Test comment';

      service.updateTranscriptionStatus(transcriptionId, statusId, comment).subscribe();

      const req = httpMock.expectOne(`api/admin/transcriptions/${transcriptionId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ transcription_status_id: statusId, workflow_comment: comment });
    });
  });

  describe('getAllowableTranscriptionStatuses', () => {
    it('returns allowed statuses', () => {
      jest.spyOn(service, 'getTranscriptionStatuses').mockReturnValue(of(MOCK_STATUSES));

      const testCases = [
        {
          status: 'Requested',
          isManual: true,
          expected: [{ displayName: 'Closed', id: 7, type: 'Closed' }],
        },
        {
          status: 'Awaiting Authorisation',
          isManual: true,
          expected: [
            { displayName: 'Requested', id: 1, type: 'Requested' },
            { displayName: 'Closed', id: 7, type: 'Closed' },
          ],
        },
        {
          status: 'Approved',
          isManual: true,
          expected: [{ displayName: 'Closed', id: 7, type: 'Closed' }],
        },
        {
          status: 'Rejected',
          isManual: true,
          expected: [],
        },
        {
          status: 'With Transcriber',
          isManual: true,
          expected: [
            { displayName: 'Approved', id: 3, type: 'Approved' },
            { displayName: 'Closed', id: 7, type: 'Closed' },
          ],
        },
        // Not manual
        {
          status: 'Requested',
          isManual: false,
          expected: [{ displayName: 'Closed', id: 7, type: 'Closed' }],
        },
        {
          status: 'Awaiting Authorisation',
          isManual: false,
          expected: [],
        },
        {
          status: 'Approved',
          isManual: false,
          expected: [{ displayName: 'Closed', id: 7, type: 'Closed' }],
        },
        {
          status: 'With Transcriber',
          isManual: false,
          expected: [
            { displayName: 'Approved', id: 3, type: 'Approved' },
            { displayName: 'Complete', id: 6, type: 'Complete' },
            { displayName: 'Closed', id: 7, type: 'Closed' },
          ],
        },
      ];

      for (const testCase of testCases) {
        let statuses: TranscriptionStatus[] = [];
        service
          .getAllowableTranscriptionStatuses(testCase.status as TranscriptStatus, testCase.isManual)
          .subscribe((s) => (statuses = s));
        expect(statuses).toEqual(testCase.expected);
      }

      expect(service.getTranscriptionStatuses).toHaveBeenCalledTimes(testCases.length);
    });
  });

  it('should map results correctly', () => {
    const results = [
      {
        id: 1,
        courthouse: { id: 1 },
        status: { id: 1 },
        caseNumber: '123',
        hearingDate: DateTime.fromISO('2023-01-01T00:00:00Z'),
        requestedAt: DateTime.fromISO('2023-06-01T00:00:00Z'),
        isManual: false,
      },
      {
        id: 2,
        courthouse: { id: 2 },
        status: { id: 2 },
        caseNumber: '456',
        hearingDate: DateTime.fromISO('2023-02-01T00:00:00Z'),
        requestedAt: DateTime.fromISO('2023-07-01T00:00:00Z'),
        isManual: true,
      },
    ] as unknown as Transcription[];

    const courthouses = [
      { id: 1, displayName: 'Courthouse 1', courthouseName: 'Main Courthouse' },
      { id: 2, displayName: 'Courthouse 2', courthouseName: 'Secondary Courthouse' },
    ] as Courthouse[];

    const statuses = [
      { id: 1, type: 'Requested', displayName: 'Status 1' },
      { id: 2, type: 'Rejected', displayName: 'Status 2' },
    ] as TranscriptionStatus[];

    const mappedResults = service.mapResults(results, courthouses, statuses);

    expect(mappedResults).toEqual([
      {
        id: 1,
        courthouse: { id: 1, displayName: 'Courthouse 1', courthouseName: 'Main Courthouse' },
        status: { id: 1, type: 'Requested', displayName: 'Status 1' },
        caseNumber: '123',
        hearingDate: DateTime.fromISO('2023-01-01T00:00:00.000+00:00'),
        requestedAt: DateTime.fromISO('2023-06-01T01:00:00.000+01:00'),
        isManual: false,
      },
      {
        id: 2,
        courthouse: { id: 2, displayName: 'Courthouse 2', courthouseName: 'Secondary Courthouse' },
        status: { id: 2, type: 'Rejected', displayName: 'Status 2' },
        caseNumber: '456',
        hearingDate: DateTime.fromISO('2023-02-01T00:00:00.000+00:00'),
        requestedAt: DateTime.fromISO('2023-07-01T01:00:00.000+01:00'),
        isManual: true,
      },
    ]);
  });

  describe('searchCompletedTranscriptions', () => {
    it('should send a POST request with correct body', () => {
      const values: TranscriptionSearchFormValues = {
        requestId: null,
        caseId: '123',
        courthouse: 'Test Courthouse',
        hearingDate: '01/01/2022',
        requestedDate: { from: '01/01/2022', to: '31/01/2022' },
        requestedBy: 'Test Requester',
        requestMethod: 'manual',
        owner: 'Test Owner',
      };

      const expectedBody = {
        case_number: '123',
        courthouse_display_name: 'TEST COURTHOUSE',
        hearing_date: '2022-01-01',
        requested_at_from: '2022-01-01',
        requested_at_to: '2022-01-31',
        requested_by: 'Test Requester',
        is_manual_transcription: true,
      };

      service.searchCompletedTranscriptions(values).subscribe();

      const req = httpMock.expectOne('api/admin/transcription-documents/search');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
    });

    it('should send a POST request with empty values', () => {
      const values: TranscriptionSearchFormValues = {
        requestId: null,
        caseId: '',
        courthouse: '',
        hearingDate: '',
        requestedDate: { from: '', to: '' },
        requestedBy: '',
        requestMethod: '',
        owner: '',
      };

      service.searchCompletedTranscriptions(values).subscribe();

      const req = httpMock.expectOne('api/admin/transcription-documents/search');
      expect(req.request.body).toEqual({
        case_number: null,
        courthouse_display_name: null,
        hearing_date: null,
        requested_at_from: null,
        requested_at_to: null,
        requested_by: null,
        is_manual_transcription: null,
      });
    });

    it('should map results correctly', () => {
      const mockResponse: TranscriptionDocumentSearchResultData[] = [
        {
          transcription_document_id: 1,
          case: { id: 1, case_number: '123' },
          courthouse: { id: 1, display_name: 'Test Courthouse' },
          hearing: { id: 1, hearing_date: '2022-01-01T00:00:00Z' },
          is_manual_transcription: true,
          transcription_id: 0,
          is_hidden: false,
        },
      ];

      let results: TranscriptionDocumentSearchResult[] = [];
      service.searchCompletedTranscriptions({}).subscribe((r) => (results = r));

      const req = httpMock.expectOne('api/admin/transcription-documents/search');
      req.flush(mockResponse);

      expect(results).toEqual([
        {
          case: { id: 1, caseNumber: '123' },
          courthouse: { id: 1, displayName: 'Test Courthouse' },
          hearing: {
            id: 1,
            hearingDate: DateTime.fromISO('2022-01-01T00:00:00Z'),
          },
          isManualTranscription: true,
          transcriptionId: 0,
          transcriptionDocumentId: 1,
          isHidden: false,
        },
      ]);
    });
  });
  describe('getTranscriptionDocument', () => {
    it('should send a GET request to fetch transcription document', () => {
      service.getTranscriptionDocument(123).subscribe();

      httpMock.expectOne({
        url: `api/admin/transcription-documents/123`,
        method: 'GET',
      });
    });

    it('maps response to TranscriptionDocument', fakeAsync(() => {
      const mockResponse = {
        transcription_document_id: 1,
        transcription_id: 2,
        file_type: 'docx',
        file_name: 'test.docx',
        file_size_bytes: 123,
        uploaded_at: '2022-01-01T00:00:00Z',
        uploaded_by: 1,
        is_hidden: false,
        checksum: undefined,
        clip_id: undefined,
        content_object_id: undefined,
        last_modified_at: '2022-01-01T00:00:00Z',
        last_modified_by: undefined,
        retain_until: '2020-01-01T00:00:00Z',
        admin_action: {
          id: 0,
          reason_id: 1,
          ticket_reference: 'ABC123',
          comments: 'Some comments',
          hidden_by_id: 0,
          hidden_at: '2020-01-01T00:00:00Z',
          is_marked_for_manual_deletion: false,
          marked_for_manual_deletion_by_id: 0,
          marked_for_manual_deletion_at: '2020-01-01T00:00:00Z',
        },
      };

      service.getTranscriptionDocument(1).subscribe((mappedResponse) =>
        expect(mappedResponse).toEqual({
          transcriptionDocumentId: 1,
          transcriptionId: 2,
          fileType: 'docx',
          fileName: 'test.docx',
          fileSizeBytes: 123,
          uploadedAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          uploadedBy: 1,
          isHidden: false,
          lastModifiedAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          lastModifiedBy: undefined,
          retainUntil: DateTime.fromISO('2020-01-01T00:00:00Z'),
          checksum: undefined,
          clipId: undefined,
          contentObjectId: undefined,
          adminAction: {
            id: 0,
            reasonId: 1,
            ticketReference: 'ABC123',
            comments: 'Some comments',
            hiddenById: 0,
            hiddenAt: DateTime.fromISO('2020-01-01T00:00:00Z'),
            isMarkedForManualDeletion: false,
            markedForManualDeletionById: 0,
            markedForManualDeletionAt: DateTime.fromISO('2020-01-01T00:00:00Z'),
          },
        })
      );

      const req = httpMock.expectOne({ url: `api/admin/transcription-documents/1`, method: 'GET' });

      req.flush(mockResponse);

      tick();
    }));
  });

  describe('hideTranscriptionDocument', () => {
    it('should send a POST request to hide the transcription document', () => {
      const id = 1;
      const formValues = {
        reason: 1,
        ticketReference: 'ABC123',
        comments: 'Some comments',
      } as FileHideOrDeleteFormValues;

      const expectedRequestBody = {
        is_hidden: true,
        admin_action: {
          reason_id: formValues.reason,
          ticket_reference: formValues.ticketReference,
          comments: formValues.comments,
        },
      };

      service.hideTranscriptionDocument(id, formValues).subscribe();

      const req = httpMock.expectOne(`api/admin/transcription-documents/${id}/hide`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedRequestBody);
    });
  });

  describe('getHiddenReasons', () => {
    it('should return an observable of hidden reasons', fakeAsync(() => {
      const hiddenReasons: HiddenReasonData[] = [
        {
          id: 1,
          reason: 'Reason 1',
          display_name: 'Display Reason 1',
          display_state: true,
          display_order: 1,
          marked_for_deletion: false,
        },
        {
          id: 2,
          reason: 'Reason 2',
          display_name: 'Display Reason 2',
          display_state: true,
          display_order: 2,
          marked_for_deletion: false,
        },
      ];

      const expectedResponse = hiddenReasons.map((reason) => ({
        id: reason.id,
        reason: reason.reason,
        displayName: reason.display_name,
        displayState: reason.display_state,
        displayOrder: reason.display_order,
        markedForDeletion: reason.marked_for_deletion,
      }));

      service.getHiddenReasons().subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne({ url: `api/admin/hidden-reasons`, method: 'GET' });
      req.flush(hiddenReasons);
      tick();
    }));
  });

  describe('getHiddenReason', () => {
    it('should return the hidden reason with the specified id', fakeAsync(() => {
      const hiddenReasons: HiddenReason[] = [
        {
          id: 1,
          reason: 'Reason 1',
          displayName: 'Display Reason 1',
          displayState: true,
          displayOrder: 1,
          markedForDeletion: false,
        },
        {
          id: 2,
          reason: 'Reason 2',
          displayName: 'Display Reason 2',
          displayState: true,
          displayOrder: 2,
          markedForDeletion: false,
        },
      ];

      const expectedReason = {
        id: 1,
        reason: 'Reason 1',
        displayName: 'Display Reason 1',
        displayState: true,
        displayOrder: 1,
        markedForDeletion: false,
      };

      jest.spyOn(service, 'getHiddenReasons').mockReturnValue(of(hiddenReasons));

      service.getHiddenReason(1).subscribe((response) => {
        expect(response).toEqual(expectedReason);
      });

      tick();
    }));

    it('should return undefined if the hidden reason with the specified id is not found', () => {
      const hiddenReasons = [
        {
          id: 1,
          reason: 'Reason 1',
          displayName: 'Display Reason 1',
          displayState: 'Active',
          displayOrder: 1,
          markedForDeletion: false,
        },
        {
          id: 2,
          reason: 'Reason 2',
          displayName: 'Display Reason 2',
          displayState: 'Active',
          displayOrder: 2,
          markedForDeletion: false,
        },
      ] as unknown as HiddenReason[];
      jest.spyOn(service, 'getHiddenReasons').mockReturnValue(of(hiddenReasons));

      service.getHiddenReason(3).subscribe((response) => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('getTranscriptionsMarkedForDeletion', () => {
    it('call api endpoint', fakeAsync(() => {
      service.getTranscriptionsMarkedForDeletion().subscribe();

      const req = httpMock.expectOne('api/admin/transcription-documents/marked-for-deletion');
      expect(req.request.method).toBe('GET');
      tick();
    }));

    it('maps response', fakeAsync(() => {
      const mockResponse: TranscriptionDocumentForDeletionData[] = [
        {
          transcription_document_id: 1,
          transcription: {
            id: 2,
          },
          case: {
            id: 3,
            case_number: 'case1',
          },
          hearing: {
            id: 4,
            hearing_date: '2021-01-01',
          },
          courthouse: {
            id: 5,
            display_name: 'courthouse1',
          },
          courtroom: {
            id: 6,
            name: 'courtroom1',
          },
          admin_action: {
            id: 7,
            reason_id: 8,
            hidden_by_id: 9,
            hidden_at: '2021-02-01T00:00:00Z',
            is_marked_for_manual_deletion: false,
            marked_for_manual_deletion_by_id: 10,
            marked_for_manual_deletion_at: '2021-03-01T00:00:00Z',
            ticket_reference: 't',
            comments: 'c',
          },
        },
      ];

      service.getTranscriptionsMarkedForDeletion().subscribe((transcriptions) =>
        expect(transcriptions).toEqual([
          {
            transcriptionDocumentId: 1,
            transcriptionId: 2,
            caseNumber: 'case1',
            hearingDate: DateTime.fromISO('2021-01-01'),
            courthouse: 'courthouse1',
            courtroom: 'courtroom1',
            hiddenById: 9,
            markedById: 10,
            comments: 'c',
            ticketReference: 't',
            reasonId: 8,
          },
        ])
      );

      const req = httpMock.expectOne('api/admin/transcription-documents/marked-for-deletion');
      req.flush(mockResponse);
      tick();
    }));
  });
});
