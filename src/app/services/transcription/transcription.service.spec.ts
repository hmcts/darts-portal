import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  TranscriptionDetails,
  TranscriptionRequest,
  UserTranscriptionRequest,
  YourTranscriptionRequests,
} from '@darts-types/index';
import { WorkRequest } from '@darts-types/work-request.interface';
import { of } from 'rxjs';
import {
  COMPLETED_TRANSCRIPTION_STATUS_ID,
  APPROVED_TRANSCRIPTION_STATUS_ID,
  REJECTED_TRANSCRIPTION_STATUS_ID,
  TranscriptionService,
} from './transcription.service';

describe('TranscriptionService', () => {
  let service: TranscriptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
      const mockRequests = {
        requester_transcriptions: [
          { transcription_id: 1, hearing_date: '2023-11-01' },
          { transcription_id: 2, hearing_date: '2023-11-02' },
        ] as Partial<UserTranscriptionRequest>,
        approver_transcriptions: [
          { transcription_id: 3, hearing_date: '2023-11-03' },
          { transcription_id: 4, hearing_date: '2023-11-04' },
        ] as Partial<UserTranscriptionRequest>,
      } as YourTranscriptionRequests;

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
      const mockRequests = [
        { transcription_id: 1, hearing_date: '2023-11-01' },
        { transcription_id: 2, hearing_date: '2023-11-02' },
      ] as Partial<WorkRequest>;

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
});
