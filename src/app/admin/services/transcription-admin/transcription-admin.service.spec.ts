import { Transcription, TranscriptionStatus } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { DateTime } from 'luxon';
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
});
