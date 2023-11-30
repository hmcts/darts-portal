import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranscriptionRequest } from '@darts-types/transcription-request.interface';

import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { UserTranscriptionRequest, YourTranscriptionRequests } from '@darts-types/user-transcription-request.interface';
import { WorkRequest } from '@darts-types/work-request.interface';
import { COMPLETED_TRANSCRIPTION_STATUS_ID, TranscriptionService } from './transcription.service';

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
        urgency_id: 2,
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
  describe('#uploadTranscript', () => {
    it('should call the correct endpoint with the correct data', () => {
      const transcriptId = '1';
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const formData = new FormData();
      formData.append('transcript', file, file.name);

      const spy = jest.spyOn(service['http'], 'post');
      service.uploadTranscript(transcriptId, file);
      expect(spy).toHaveBeenCalledWith(`/api/transcriptions/${transcriptId}/document`, formData);
    });
  });
});
