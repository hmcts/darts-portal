import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranscriptionRequest } from '@darts-types/transcription-request.interface';

import { of } from 'rxjs';
import { TranscriptionService } from './transcription.service';

describe('TranscriptionService', () => {
  let service: TranscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TranscriptionService);
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
  });

  describe('#deleteRequest', () => {
    it('should call the correct endpoint', () => {
      const spy = jest.spyOn(service['http'], 'delete');
      service.deleteRequest(1);
      expect(spy).toHaveBeenCalledWith('api/transcriptions/1', { observe: 'response' });
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
});
