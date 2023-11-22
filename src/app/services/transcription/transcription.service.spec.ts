import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranscriptionRequest } from '@darts-types/transcription-request.interface';

import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { of } from 'rxjs';
import { TranscriptionService } from './transcription.service';

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

    it('should default the filename when it does not exist', () => {
      const detail: TranscriptionDetails = {
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

      jest.spyOn(service, 'getTranscriptionDetails').mockReturnValue(of(detail));
      let filename;
      service.getTranscriptionDetails(1).subscribe({
        next: (d: TranscriptionDetails) => {
          filename = d.transcript_file_name;
        },
      });
      const req = httpMock.expectOne(`/api/transcriptions/1`);
      expect(req.request.method).toBe('GET');
      req.flush(detail);

      expect(filename).toEqual('POOP not found');
    });
  });
});
