import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import {
  TranscriptRequestData,
  TranscriptionDetails,
  TranscriptionDetailsData,
  TranscriptionRequest,
  Urgency,
  WorkRequest,
  WorkRequestData,
  YourTranscriptsData,
} from '@portal-types/index';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import {
  APPROVED_TRANSCRIPTION_STATUS_ID,
  COMPLETED_TRANSCRIPTION_STATUS_ID,
  REJECTED_TRANSCRIPTION_STATUS_ID,
  TranscriptionService,
} from './transcription.service';

describe('TranscriptionService', () => {
  let service: TranscriptionService;
  let httpMock: HttpTestingController;

  const MOCK_URGENCIES: Urgency[] = [
    { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 },
    { transcription_urgency_id: 2, description: 'Up to 2 working days', priority_order: 2 },
    { transcription_urgency_id: 3, description: 'Up to 3 working days', priority_order: 3 },
    { transcription_urgency_id: 4, description: 'Up to 7 working days', priority_order: 4 },
    { transcription_urgency_id: 5, description: 'Up to 12 working days', priority_order: 5 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), LuxonDatePipe, DatePipe],
    });
    service = TestBed.inject(TranscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getUrgencies', () => {
    it('call the correct endpoint and return the urgencies', (done) => {
      service.getUrgencies().subscribe((urgencies) => {
        expect(urgencies).toEqual(MOCK_URGENCIES);
        done();
      });

      const req = httpMock.expectOne('/api/transcriptions/urgencies');
      req.flush(MOCK_URGENCIES);
    });

    it('only make one call and share results to subsequent subscribers ', () => {
      service.getUrgencies().subscribe();
      service.getUrgencies().subscribe();
      service.getUrgencies().subscribe();

      const req = httpMock.expectOne('/api/transcriptions/urgencies');
      req.flush(MOCK_URGENCIES);

      httpMock.verify();
    });
  });

  describe('#getTranscriptionTypes', () => {
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'get');
      service.getTranscriptionTypes();
      expect(spy).toHaveBeenCalledWith('/api/transcriptions/types');
    });
  });

  describe('#getWorkRequests', () => {
    it('should map workRequests', (done) => {
      jest.spyOn(service, 'getUrgencies').mockReturnValue(of(MOCK_URGENCIES));
      const mockRequests: WorkRequestData[] = [
        {
          transcription_id: 1,
          case_id: 1,
          case_number: 'T2023453422',
          courthouse_name: 'Reading',
          hearing_date: '2023-11-01',
          transcription_type: 'Court log',
          status: 'With Transcriber',
          transcription_urgency: {
            transcription_urgency_id: 2,
            description: 'Up to 2 working days',
            priority_order: 2,
          },
          requested_ts: '2023-11-01',
          state_change_ts: '2023-11-01',
          is_manual: false,
        },
      ];

      const mappedRequests: WorkRequest[] = [
        {
          transcriptionId: 1,
          caseId: 1,
          caseNumber: 'T2023453422',
          courthouseName: 'Reading',
          hearingDate: DateTime.fromISO('2023-11-01T00:00:00Z'),
          transcriptionType: 'Court log',
          status: 'With Transcriber',
          urgency: {
            transcription_urgency_id: 2,
            description: 'Up to 2 working days',
            priority_order: 2,
          },
          requestedTs: DateTime.fromISO('2023-11-01T00:00:00Z'),
          stateChangeTs: DateTime.fromISO('2023-11-01T00:00:00Z'),
          isManual: false,
        },
      ];

      service.getWorkRequests().subscribe((transformedRequests) => {
        expect(transformedRequests[0]).toEqual(mappedRequests[0]);
        done();
      });

      const req = httpMock.expectOne('/api/transcriptions/transcriber-view?assigned=true');
      req.flush(mockRequests);
    });
  });

  describe('#postTranscriptionRequest', () => {
    it('should call the correct endpoint', () => {
      const postObject: TranscriptionRequest = {
        case_id: 1,
        comment: 'test',
        end_date_time: '2023-02-21T18:00:00Z',
        hearing_id: 1,
        start_date_time: '2023-02-21T13:00:00Z',
        transcription_type_id: 3,
        transcription_urgency_id: 2,
      };
      const spy = jest.spyOn(service['http'], 'post');
      service.postTranscriptionRequest(postObject);
      expect(spy).toHaveBeenCalledWith('/api/transcriptions', postObject);
    });
  });

  describe('#getTranscriptionDetails', () => {
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'get');
      service.getTranscriptionDetails(1);
      expect(spy).toHaveBeenCalledWith('/api/transcriptions/1');
    });

    it('should map TranscriptionDetails', () => {
      // Simulate a scenario where transcript_file_name is not provided in the response
      const mockTranscriptionResponse: TranscriptionDetailsData = {
        case_id: 1,
        case_number: '123',
        courthouse: 'Swansea',
        courtroom: '1',
        defendants: ['defendant1', 'defendant2'],
        judges: ['judge1', 'judge2'],
        hearing_date: '2023-02-21T18:00:00Z',
        transcription_urgency: {
          transcription_urgency_id: 1,
          description: 'Overnight',
          priority_order: 1,
        },
        request_type: 'Specified Times',
        transcription_start_ts: '2023-06-26T13:00:00Z',
        transcription_end_ts: '2023-06-26T13:00:00Z',
        transcript_file_name: '',
        transcription_id: 4,
        transcription_object_id: 2,
        is_manual: false,
        hearing_id: 3,
        courthouse_id: 2,
        requestor: {
          user_id: 3,
          user_full_name: 'test user',
        },
      };

      const mappedTranscription: TranscriptionDetails = {
        caseId: 1,
        caseNumber: '123',
        courthouse: 'Swansea',
        courtroom: '1',
        defendants: ['defendant1', 'defendant2'],
        judges: ['judge1', 'judge2'],
        hearingDate: DateTime.fromISO('2023-02-21T18:00:00Z'),
        urgency: {
          transcription_urgency_id: 1,
          description: 'Overnight',
          priority_order: 1,
        },
        requestType: 'Specified Times',
        transcriptionId: 4,
        transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00Z'),
        transcriptionEndTs: DateTime.fromISO('2023-06-26T13:00:00Z'),
        transcriptFileName: '',
        transcriptionObjectId: 2,
        isManual: false,
        hearingId: 3,
        courthouseId: 2,
        from: 'test user',
      };

      let result = {} as TranscriptionDetails;

      service.getTranscriptionDetails(1).subscribe((t) => {
        result = t;
      });

      const req = httpMock.expectOne('/api/transcriptions/1');
      req.flush(mockTranscriptionResponse);

      expect(result).toEqual(mappedTranscription);
    });
  });

  describe('#completeTranscriptionRequest', () => {
    it('should call the correct endpoint and update the transcription status', () => {
      const transcriptId = 1;
      const patchObject = {
        transcription_status_id: COMPLETED_TRANSCRIPTION_STATUS_ID,
      };
      const spy = jest.spyOn(service['http'], 'patch');
      service.completeTranscriptionRequest(transcriptId);
      expect(spy).toHaveBeenCalledWith(`/api/transcriptions/${transcriptId}`, patchObject);
    });
  });

  describe('#approveTranscriptionRequest', () => {
    it('should call the correct endpoint and update the transcription status', () => {
      const transcriptId = 1;
      const patchObject = {
        transcription_status_id: APPROVED_TRANSCRIPTION_STATUS_ID,
      };
      const spy = jest.spyOn(service['http'], 'patch');
      service.approveTranscriptionRequest(transcriptId);
      expect(spy).toHaveBeenCalledWith(`/api/transcriptions/${transcriptId}`, patchObject);
    });
  });

  describe('#rejectTranscriptionRequest', () => {
    it('should call the correct endpoint and update the transcription status', () => {
      const transcriptId = 1;
      const patchObject = {
        transcription_status_id: REJECTED_TRANSCRIPTION_STATUS_ID,
        workflow_comment: "I don't like this transcription request",
      };
      const spy = jest.spyOn(service['http'], 'patch');
      service.rejectTranscriptionRequest(transcriptId, "I don't like this transcription request");
      expect(spy).toHaveBeenCalledWith(`/api/transcriptions/${transcriptId}`, patchObject);
    });
  });
  describe('#uploadTranscript', () => {
    it('should call the correct endpoint with the correct data', (done) => {
      const transcriptId = '1';
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const formData = new FormData();
      formData.append('transcript', file, file.name);

      const spyPost = jest.spyOn(service['http'], 'post');
      const spyDecrement = jest.spyOn(service.countService, 'decrementAssignedTranscriptCount');

      service.uploadTranscript(transcriptId, file).subscribe(() => {
        expect(spyPost).toHaveBeenCalledWith(`/api/transcriptions/${transcriptId}/document`, formData);
        expect(spyDecrement).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`/api/transcriptions/${transcriptId}/document`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);

      req.flush({});
    });
  });

  describe('#deleteRequest', () => {
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'patch');
      service.deleteRequest([1]);
      expect(spy).toHaveBeenCalledWith('api/transcriptions', [
        {
          transcription_id: 1,
          hide_request_from_requestor: true,
        },
      ]);
    });
  });

  describe('#getYourTranscripts', () => {
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'get');
      service.getYourTranscripts();
      expect(spy).toHaveBeenCalledWith('/api/transcriptions');
    });

    it('maps YourTranscriptsData to YourTranscripts', (done) => {
      const mockRequests: YourTranscriptsData = {
        requester_transcriptions: [
          {
            transcription_id: 1,
            case_id: 1,
            case_number: '123',
            courthouse_name: 'Swansea',
            hearing_date: '2023-11-01',
            transcription_type: 'Type',
            status: 'Awaiting Authorisation',
            transcription_urgency: {
              transcription_urgency_id: 1,
              description: 'Up to 2 working days',
              priority_order: 1,
            },
            requested_ts: '2023-11-01T00:00:00Z',
          },
        ],
        approver_transcriptions: [
          {
            transcription_id: 2,
            case_id: 2,
            case_number: '123',
            courthouse_name: 'Swansea',
            hearing_date: '2023-11-01',
            transcription_type: 'Type',
            status: 'Awaiting Authorisation',
            transcription_urgency: {
              transcription_urgency_id: 1,
              description: 'Up to 2 working days',
              priority_order: 1,
            },
            requested_ts: '2023-11-01T00:00:00Z',
          },
        ],
      };

      const expected = {
        requesterTranscriptions: [
          {
            transcriptionId: 1,
            caseId: 1,
            caseNumber: '123',
            courthouseName: 'Swansea',
            hearingDate: DateTime.fromISO('2023-11-01'),
            transcriptionType: 'Type',
            status: 'Awaiting Authorisation',
            urgency: {
              transcription_urgency_id: 1,
              description: 'Up to 2 working days',
              priority_order: 1,
            },
            requestedTs: DateTime.fromISO('2023-11-01T00:00:00Z'),
          },
        ],
        approverTranscriptions: [
          {
            transcriptionId: 2,
            caseId: 2,
            caseNumber: '123',
            courthouseName: 'Swansea',
            hearingDate: DateTime.fromISO('2023-11-01'),
            transcriptionType: 'Type',
            status: 'Awaiting Authorisation',
            urgency: {
              transcription_urgency_id: 1,
              description: 'Up to 2 working days',
              priority_order: 1,
            },
            requestedTs: DateTime.fromISO('2023-11-01T00:00:00Z'),
          },
        ],
      };

      service.getUrgencies = jest.fn().mockReturnValue(of(MOCK_URGENCIES));

      service.getYourTranscripts().subscribe((result) => {
        expect(result).toEqual(expected);
        done();
      });

      const req = httpMock.expectOne('/api/transcriptions');
      req.flush(mockRequests);
    });
  });

  describe('#assignTranscript', () => {
    it('should call the correct endpoint and update the transcription status', (done) => {
      const transcriptId = 1;
      const patchObject = {
        transcription_status_id: 5,
      };
      const spyPatch = jest.spyOn(service['http'], 'patch');
      const spyDecrement = jest.spyOn(service.countService, 'decrementUnassignedTranscriptCount');
      const spyIncrement = jest.spyOn(service.countService, 'incrementAssignedTranscriptCount');

      service.assignTranscript(transcriptId).subscribe(() => {
        expect(spyPatch).toHaveBeenCalledWith(`/api/transcriptions/${transcriptId}`, patchObject);
        expect(spyDecrement).toHaveBeenCalled();
        expect(spyIncrement).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`/api/transcriptions/${transcriptId}`);
      req.flush({});
    });
  });

  describe('#completeTranscriptionRequest', () => {
    it('should call the correct endpoint and update the transcription status', (done) => {
      const transcriptId = 1;
      const patchObject = {
        transcription_status_id: COMPLETED_TRANSCRIPTION_STATUS_ID,
      };
      const spyPatch = jest.spyOn(service['http'], 'patch');
      const spyDecrement = jest.spyOn(service.countService, 'decrementAssignedTranscriptCount');

      service.completeTranscriptionRequest(transcriptId).subscribe(() => {
        expect(spyPatch).toHaveBeenCalledWith(`/api/transcriptions/${transcriptId}`, patchObject);
        expect(spyDecrement).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`/api/transcriptions/${transcriptId}`);
      req.flush({});
    });
  });

  describe('#downloadTranscriptDocument', () => {
    it('should call the correct endpoint and return a Blob', (done) => {
      const transcriptId = 1;
      const mockBlob = new Blob(['test'], { type: 'text/plain' });

      service.downloadTranscriptDocument(transcriptId).subscribe((result) => {
        expect(result instanceof Blob).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/api/transcriptions/${transcriptId}/document`);
      req.flush(mockBlob);
    });
  });

  describe('Mapping transcript request functions', () => {
    const mockTranscription: TranscriptionDetails = {
      caseId: 1,
      caseNumber: '123',
      courthouse: 'Swansea',
      courtroom: '2',
      defendants: ['John Doe', 'Jane Doe'],
      judges: ['Judge Judy', 'Judge Joe Brown'],
      hearingDate: DateTime.fromISO('2023-11-08'),
      urgency: {
        transcription_urgency_id: 1,
        description: 'High',
        priority_order: 1,
      },
      requestType: 'Type A',
      transcriptionId: 123456,
      transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00'),
      transcriptionEndTs: DateTime.fromISO('2023-06-26T16:00:00'),
      transcriptionObjectId: 2,
      received: DateTime.fromISO('2023-11-17T12:53:07.468'),
      from: 'MoJ CH Swansea',
      requestorComments: 'Please expedite my request',
      transcriptFileName: '',
      isManual: false,
      hearingId: 0,
      courthouseId: 0,
    };

    it('should correctly transform TranscriptionDetails to a case details object', () => {
      const expectedResult = {
        'Case ID': '123',
        Courthouse: 'Swansea',
        'Judge(s)': ['Judge Judy', 'Judge Joe Brown'],
        'Defendant(s)': ['John Doe', 'Jane Doe'],
      };

      const result = service.getCaseDetailsFromTranscript(mockTranscription);

      expect(result).toEqual(expectedResult);
    });

    it('should transform TranscriptionDetails to a request details object', () => {
      const expectedResult = {
        'Hearing date': '08 Nov 2023',
        'Request type': 'Type A',
        'Request ID': 123456,
        Urgency: 'High',
        'Audio for transcript': 'Start time 13:00:00 - End time 16:00:00',
        Requested: 'MoJ CH Swansea',
        Received: '17 Nov 2023 12:53:07',
        Instructions: 'Please expedite my request',
        'Judge approval': 'Yes',
      };

      const result = service.getRequestDetailsFromTranscript(mockTranscription);

      expect(result).toEqual(expectedResult);
    });

    it('should correctly transform TranscriptionDetails to hearing request details', () => {
      const expectedResult = {
        'Hearing date': '08 Nov 2023',
        'Request type': 'Type A',
        'Request ID': 123456,
        Urgency: 'High',
        'Audio for transcript': 'Start time 13:00:00 - End time 16:00:00',
      };

      const result = service.getHearingRequestDetailsFromTranscript(mockTranscription);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('#mapYourTranscriptRequestData', () => {
    it('should map Approved status to With Transcriber', () => {
      const data = [{ status: 'Approved' }] as TranscriptRequestData[];
      const mappedData = service['mapYourTranscriptRequestData'](data);
      expect(mappedData[0].status).toEqual('With Transcriber');
    });
  });

  describe('#getAssignDetailsFromTranscript', () => {
    it('should return the assign details from the transcript', () => {
      const transcript: TranscriptionDetails = {
        hearingId: 1,
        caseId: 1,
        caseNumber: '123',
        courthouse: 'Swansea',
        courtroom: '2',
        defendants: ['John Doe', 'Jane Doe'],
        judges: ['Judge Judy', 'Judge Joe Brown'],
        transcriptFileName: '',
        hearingDate: DateTime.fromISO('2023-11-08'),
        urgency: {
          transcription_urgency_id: 1,
          description: 'High',
          priority_order: 1,
        },
        requestType: 'Type A',
        transcriptionId: 123456,
        transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00'),
        transcriptionEndTs: DateTime.fromISO('2023-06-26T18:00:00'),
        transcriptionObjectId: 2,
        received: DateTime.fromISO('2023-11-17T12:53:07.468'),
        from: 'MoJ CH Swansea',
        requestorComments: 'Please expedite my request',
        isManual: false,
      };

      const assignDetails = service.getAssignDetailsFromTranscript(transcript);

      expect(assignDetails).toEqual({
        reportingRestrictions: [],
        caseDetails: {
          'Case ID': '123',
          Courthouse: 'Swansea',
          'Judge(s)': ['Judge Judy', 'Judge Joe Brown'],
          'Defendant(s)': ['John Doe', 'Jane Doe'],
        },
        hearingDetails: {
          'Hearing date': '08 Nov 2023',
          'Request type': 'Type A',
          'Request method': 'Automated',
          'Request ID': 123456,
          Urgency: 'High',
          'Audio for transcript': 'Start time 13:00:00 - End time 18:00:00',
          From: 'MoJ CH Swansea',
          Received: '17 Nov 2023 12:53:07',
          Instructions: 'Please expedite my request',
          'Judge approval': 'Yes',
        },
        hearingId: 1,
        caseId: 1,
      });
    });
  });
});
