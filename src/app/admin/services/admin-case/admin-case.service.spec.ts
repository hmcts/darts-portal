import { AdminCaseData } from '@admin-types/case/case.interface';
import { AdminCase } from '@admin-types/case/case.type';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { AdminCaseService } from './admin-case.service';

describe('AdminCaseService', () => {
  let service: AdminCaseService;
  let httpMock: HttpTestingController;

  const mockCaseData: AdminCaseData = {
    id: 1,
    case_number: 'CASE1001',
    courthouse: {
      id: 1001,
      display_name: 'SWANSEA',
    },
    defendants: ['Joe Bloggs'],
    judges: ['Mr Judge'],
    prosecutors: ['Mrs Prosecutor'],
    defenders: ['Mr Defender'],
    reporting_restrictions: [
      {
        event_id: 123,
        event_name: 'Verdict',
        event_text: 'Manually entered text',
        hearing_id: 123,
        event_ts: '2024-01-01T00:00:00Z',
      },
    ],
    retain_until_date_time: '2030-01-31T15:42:10.361Z',
    case_closed_date_time: '2023-07-20T15:42:10.361Z',
    retention_date_time_applied: '2023-07-22T15:42:10.361Z',
    retention_policy_applied: 'MANUAL',
    case_object_id: '12345',
    case_status: 'OPEN',
    created_at: '2024-01-01T00:00:00Z',
    created_by: 5,
    last_modified_at: '2024-01-01T00:00:00Z',
    last_modified_by: 5,
    is_deleted: false,
    case_deleted_at: '2024-01-01T00:00:00Z',
    is_data_anonymised: false,
    data_anonymised_at: '2024-01-01T00:00:00Z',
    is_interpreter_used: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminCaseService],
    });

    service = TestBed.inject(AdminCaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCase', () => {
    it('should fetch case data and map it correctly', () => {
      const expectedMappedCase: AdminCase = {
        id: 1,
        caseNumber: 'CASE1001',
        courthouse: {
          id: 1001,
          displayName: 'SWANSEA',
        },
        defendants: ['Joe Bloggs'],
        judges: ['Mr Judge'],
        prosecutors: ['Mrs Prosecutor'],
        defenders: ['Mr Defender'],
        reportingRestrictions: [
          {
            event_id: 123,
            event_name: 'Verdict',
            event_text: 'Manually entered text',
            hearing_id: 123,
            event_ts: '2024-01-01T00:00:00Z',
          },
        ],
        retainUntilDateTime: DateTime.fromISO('2030-01-31T15:42:10.361Z'),
        caseClosedDateTime: DateTime.fromISO('2023-07-20T15:42:10.361Z'),
        retentionDateTimeApplied: DateTime.fromISO('2023-07-22T15:42:10.361Z'),
        retentionPolicyApplied: 'MANUAL',
        caseObjectId: '12345',
        caseStatus: 'OPEN',
        createdAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        createdById: 5,
        lastModifiedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        lastModifiedById: 5,
        isDeleted: false,
        caseDeletedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        isDataAnonymised: false,
        dataAnonymisedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        isInterpreterUsed: false,
      };

      service.getCase(1).subscribe((caseData) => {
        expect(caseData).toEqual(expectedMappedCase);
      });

      const req = httpMock.expectOne(`/api/admin/cases/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCaseData);
    });
  });

  describe('mapCaseDataToCase', () => {
    it('should correctly map case data to AdminCase', () => {
      const mappedCase = service.mapCaseDataToCase(mockCaseData);

      expect(mappedCase).toEqual({
        id: 1,
        caseNumber: 'CASE1001',
        courthouse: {
          id: 1001,
          displayName: 'SWANSEA',
        },
        defendants: ['Joe Bloggs'],
        judges: ['Mr Judge'],
        prosecutors: ['Mrs Prosecutor'],
        defenders: ['Mr Defender'],
        reportingRestrictions: [
          {
            event_id: 123,
            event_name: 'Verdict',
            event_text: 'Manually entered text',
            hearing_id: 123,
            event_ts: '2024-01-01T00:00:00Z',
          },
        ],
        retainUntilDateTime: DateTime.fromISO('2030-01-31T15:42:10.361Z'),
        caseClosedDateTime: DateTime.fromISO('2023-07-20T15:42:10.361Z'),
        retentionDateTimeApplied: DateTime.fromISO('2023-07-22T15:42:10.361Z'),
        retentionPolicyApplied: 'MANUAL',
        caseObjectId: '12345',
        caseStatus: 'OPEN',
        createdAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        createdById: 5,
        lastModifiedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        lastModifiedById: 5,
        isDeleted: false,
        caseDeletedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        isDataAnonymised: false,
        dataAnonymisedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        isInterpreterUsed: false,
      });
    });

    it('should handle missing optional values', () => {
      const partialCaseData: AdminCaseData = {
        id: 2,
        case_number: 'CASE2002',
        courthouse: {
          id: 2002,
          display_name: 'CARDIFF',
        },
        case_status: 'CLOSED',
        case_object_id: '67890',
        created_at: '2024-02-01T12:00:00Z',
        created_by: 7,
        last_modified_at: '2024-02-02T12:00:00Z',
        last_modified_by: 7,
        is_deleted: true,
        is_data_anonymised: true,
        is_interpreter_used: true,
      };

      const mappedCase = service.mapCaseDataToCase(partialCaseData);

      expect(mappedCase).toEqual({
        id: 2,
        caseNumber: 'CASE2002',
        courthouse: {
          id: 2002,
          displayName: 'CARDIFF',
        },
        defendants: undefined,
        judges: undefined,
        prosecutors: undefined,
        defenders: undefined,
        reportingRestrictions: [],
        retainUntilDateTime: undefined,
        caseClosedDateTime: undefined,
        retentionDateTimeApplied: undefined,
        retentionPolicyApplied: undefined,
        caseObjectId: '67890',
        caseStatus: 'CLOSED',
        createdAt: DateTime.fromISO('2024-02-01T12:00:00Z'),
        createdById: 7,
        lastModifiedAt: DateTime.fromISO('2024-02-02T12:00:00Z'),
        lastModifiedById: 7,
        isDeleted: true,
        caseDeletedAt: undefined,
        isDataAnonymised: true,
        dataAnonymisedAt: undefined,
        isInterpreterUsed: true,
      });
    });
  });
});
