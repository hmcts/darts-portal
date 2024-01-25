import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  TranscriptionDetails,
  TranscriptionRequest,
  TranscriptionUrgency,
  UserTranscriptionRequestVm,
  YourTranscriptionRequestsVm,
} from '@darts-types/index';
import { WorkRequestVm } from '@darts-types/work-request.interface';
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

  const MOCK_URGENCIES: TranscriptionUrgency[] = [
    { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 },
    { transcription_urgency_id: 2, description: 'Up to 2 working days', priority_order: 2 },
    { transcription_urgency_id: 3, description: 'Up to 3 working days', priority_order: 3 },
    { transcription_urgency_id: 4, description: 'Up to 7 working days', priority_order: 4 },
    { transcription_urgency_id: 5, description: 'Up to 12 working days', priority_order: 5 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatePipe, { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } }],
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
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'get');
      service.getUrgencies();
      expect(spy).toHaveBeenCalledWith('/api/transcriptions/urgencies');
    });
  });

  describe('#getTranscriptionTypes', () => {
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'get');
      service.getTranscriptionTypes();
      expect(spy).toHaveBeenCalledWith('/api/transcriptions/types');
    });
  });

  describe('#getTranscriptionRequests', () => {
    it('should transform hearing dates', (done) => {
      jest.spyOn(service, 'getUrgencies').mockReturnValue(of(MOCK_URGENCIES));
      const mockRequests = {
        requester_transcriptions: [
          { transcription_id: 1, hearing_date: '2023-11-01' },
          { transcription_id: 2, hearing_date: '2023-11-02' },
        ] as Partial<UserTranscriptionRequestVm>,
        approver_transcriptions: [
          { transcription_id: 3, hearing_date: '2023-11-03' },
          { transcription_id: 4, hearing_date: '2023-11-04' },
        ] as Partial<UserTranscriptionRequestVm>,
      } as YourTranscriptionRequestsVm;

      service.getTranscriptionRequests().subscribe((transformedRequests) => {
        expect(transformedRequests.requester_transcriptions[0].hearing_date).toBe('2023-11-01T00:00:00Z');
        expect(transformedRequests.requester_transcriptions[1].hearing_date).toBe('2023-11-02T00:00:00Z');
        expect(transformedRequests.approver_transcriptions[0].hearing_date).toBe('2023-11-03T00:00:00Z');
        expect(transformedRequests.approver_transcriptions[1].hearing_date).toBe('2023-11-04T00:00:00Z');

        done();
      });

      const req = httpMock.expectOne('/api/transcriptions');
      req.flush(mockRequests);
    });
  });

  describe('#getWorkRequests', () => {
    it('should transform hearing dates', (done) => {
      jest.spyOn(service, 'getUrgencies').mockReturnValue(of(MOCK_URGENCIES));
      const mockRequests = [
        { transcription_id: 1, hearing_date: '2023-11-01' },
        { transcription_id: 2, hearing_date: '2023-11-02' },
      ] as Partial<WorkRequestVm>;

      service.getWorkRequests().subscribe((transformedRequests) => {
        expect(transformedRequests[0].hearing_date).toBe('2023-11-01T00:00:00Z');
        expect(transformedRequests[1].hearing_date).toBe('2023-11-02T00:00:00Z');

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

    it('should return TranscriptionDetails with default filename if not provided', (done) => {
      // Simulate a scenario where transcript_file_name is not provided in the response
      const mockTranscription: Partial<TranscriptionDetails> = {
        case_id: 1,
        case_number: '123',
        courthouse: 'Swansea',
        defendants: [],
        judges: [],
        hearing_date: '',
        urgency: '',
        request_type: '',
        transcription_start_ts: '',
        transcription_end_ts: '',
      };

      service.getTranscriptionDetails(1).subscribe((result) => {
        expect(result.transcript_file_name).toEqual('Document not found');
        done();
      });

      const req = httpMock.expectOne('/api/transcriptions/1');
      req.flush(mockTranscription);
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

  describe('#getTranscriptionRequests', () => {
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'get');
      service.getTranscriptionRequests();
      expect(spy).toHaveBeenCalledWith('/api/transcriptions');
    });

    it('should map hearing date to UTC timestamp', fakeAsync(() => {
      jest.spyOn(service, 'getUrgencies').mockReturnValue(of(MOCK_URGENCIES));
      jest.spyOn(service['http'], 'get').mockReturnValue(
        of({
          approver_transcriptions: [
            {
              hearing_date: '2023-06-10',
            },
          ],
          requester_transcriptions: [
            {
              hearing_date: '2023-06-12',
            },
          ],
        })
      );

      let approverDate!: string;
      let requesterDate!: string;

      service.getTranscriptionRequests().subscribe((data) => {
        approverDate = data.approver_transcriptions[0].hearing_date;
        requesterDate = data.requester_transcriptions[0].hearing_date;
      });

      tick();

      expect(approverDate).toEqual('2023-06-10T00:00:00Z');
      expect(requesterDate).toEqual('2023-06-12T00:00:00Z');
    }));
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

  describe('#getUrgencyByDescription', () => {
    it('should return the TranscriptionUrgency object where the description matches', () => {
      const response = service.getUrgencyByDescription(MOCK_URGENCIES, 'Up to 3 working days');
      const result: TranscriptionUrgency = {
        transcription_urgency_id: 3,
        description: 'Up to 3 working days',
        priority_order: 3,
      };
      expect(response).toEqual(result);
    });
  });

  describe('#mapUrgencyToTranscripts', () => {
    it('should map urgency to transcripts', () => {
      const requests = [
        { urgency: 'Overnight' },
        { urgency: 'Up to 2 working days' },
        { urgency: 'Up to 3 working days' },
      ];
      const urgencies = [
        { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 },
        { transcription_urgency_id: 2, description: 'Up to 2 working days', priority_order: 2 },
        { transcription_urgency_id: 3, description: 'Up to 3 working days', priority_order: 3 },
        { transcription_urgency_id: 4, description: 'Up to 7 working days', priority_order: 4 },
        { transcription_urgency_id: 5, description: 'Up to 12 working days', priority_order: 5 },
      ];

      const expected = [
        { urgency: { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 } },
        { urgency: { transcription_urgency_id: 2, description: 'Up to 2 working days', priority_order: 2 } },
        { urgency: { transcription_urgency_id: 3, description: 'Up to 3 working days', priority_order: 3 } },
      ];

      const result = service.mapUrgencyToTranscripts(requests, urgencies);
      expect(result).toEqual(expected);
    });
  });

  describe('Mapping transcript request functions', () => {
    const mockTranscription = {
      case_id: 1,
      case_number: '123',
      courthouse: 'Swansea',
      defendants: ['John Doe', 'Jane Doe'],
      judges: ['Judge Judy', 'Judge Joe Brown'],
      hearing_date: '2023-11-08',
      urgency: 'High',
      request_type: 'Type A',
      transcription_id: '123456',
      transcription_start_ts: '2023-06-26T13:00:00Z',
      transcription_end_ts: '2023-06-26T16:00:00Z',
      received: '2023-11-17T12:53:07.468Z',
      from: 'MoJ CH Swansea',
      requestor_comments: 'Please expedite my request',
    } as unknown as TranscriptionDetails;

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
        'Hearing Date': '08 Nov 2023',
        'Request Type': 'Type A',
        'Request ID': '123456',
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
        'Hearing Date': '08 Nov 2023',
        'Request Type': 'Type A',
        'Request ID': '123456',
        Urgency: 'High',
        'Audio for transcript': 'Start time 13:00:00 - End time 16:00:00',
      };

      const result = service.getHearingRequestDetailsFromTranscript(mockTranscription);

      expect(result).toEqual(expectedResult);
    });
  });
});
