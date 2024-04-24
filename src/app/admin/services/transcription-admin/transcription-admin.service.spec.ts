import { Transcription, TranscriptionStatus } from '@admin-types/index';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { TranscriptionAdminDetailsData } from '@admin-types/transcription/transcription-details-data.interface';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { TranscriptionAdminService } from './transcription-admin.service';

describe('TranscriptionAdminService', () => {
  let service: TranscriptionAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranscriptionAdminService, LuxonDatePipe, DatePipe],
    });
    service = TestBed.inject(TranscriptionAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to search transcriptions', () => {
    const formValues = {
      requestId: '123',
      caseId: '456',
      courthouse: 'Test Courthouse',
      hearingDate: '2022-01-01',
      owner: 'Test Owner',
      requestedBy: 'Test Requester',
      requestedDate: { from: '2022-01-01', to: '2022-01-31' },
      requestMethod: 'manual',
    };

    const expectedBody = {
      transcription_id: 123,
      case_number: '456',
      courthouse_display_name: 'Test Courthouse',
      hearing_date: '2022-01-01',
      owner: 'Test Owner',
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
      courthouse_id: 1,
      status: 'With transcriber',
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
      transcription_id: 12345,
      transcription_start_ts: '2023-06-26T13:00:00Z',
      transcription_end_ts: '2023-06-26T16:00:00Z',
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
      courthouseId: 1,
      status: 'With transcriber',
      from: 'MoJ CH Swansea',
      received: DateTime.fromISO('2023-11-17T12:53:07.468Z'),
      requestorComments: 'Please expedite my request',
      rejectionReason: 'This request will take longer to transcribe within the urgency level you require.',
      defendants: ['Defendant Dave', 'Defendant Bob'],
      judges: ['HHJ M. Hussain KC\t', 'Ray Bob'],
      transcriptFileName: 'C20220620001_0.docx',
      hearingDate: DateTime.fromISO('2023-11-08T00:00:00.000Z'),
      urgency: 'Standard',
      requestType: 'Specified Times',
      transcriptionId: 12345,
      transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00.000Z'),
      transcriptionEndTs: DateTime.fromISO('2023-06-26T16:00:00.000Z'),
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
    expect(req.request.params.get('current')).toBe(String(current));
    expect(req.request.params.get('transcription_id')).toBe(String(transcriptionId));
    req.flush(mockWorkflows);

    expect(wflows[0].workflowActor).toBe(1);
    expect(wflows[0].statusId).toBe(2);
    expect(wflows[0].workflowTimestamp.toISO()).toBe('2021-01-01T00:00:00.000Z');
  });

  it('should return correct status and associated data based on transcript details', () => {
    const transcript = {
      status: 'Awaiting authorisation',
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

    expect(result.Status.value).toBe('Awaiting authorisation');
    expect(result.Status.action?.text).toBe('Change status');
    expect(result.Status.action?.url).toBe('/temp-transcription-admin-service');
    expect(result['Assigned to'][0].href).toBe('/admin/users/1');
    expect(result['Assigned to'][0].value).toBe('John Doe');
    expect(result['Assigned to'][0].caption).toBe('john.doe@example.com');
    expect(result['Associated groups']).toEqual([
      { href: '/admin/groups/1', value: 'Group One' },
      { href: '/admin/groups/2', value: 'Group Two' },
    ]);
  });

  it('should format transcription details correctly', () => {
    const transcript = {
      hearingDate: DateTime.fromISO('2024-01-01T00:00:00Z'),
      requestType: 'Type1',
      isManual: true,
      transcriptionId: 123,
      urgency: 'High',
      transcriptionStartTs: DateTime.fromISO('2024-03-03T09:00:00Z'),
      transcriptionEndTs: DateTime.fromISO('2024-03-03T10:00:00Z'),
      requestor: { userId: 1, fullName: 'John Doe', email: 'john@example.com' },
      received: DateTime.fromISO('2024-01-01T13:30:00Z'),
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
      Instructions: 'Need ASAP',
      'Judge approval': 'Yes',
    });
  });
});
