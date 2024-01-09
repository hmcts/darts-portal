import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { RequestedMedia } from '@darts-types/requested-media.interface';
import { of } from 'rxjs';
import { AudioRequestService } from './audio-request.service';

describe('AudioService', () => {
  let service: AudioRequestService;
  let httpMock: HttpTestingController;

  const MOCK_MEDIA_REQUESTS: RequestedMedia = {
    media_request_details: [
      {
        case_id: 1,
        media_request_id: 1,
        case_number: 'C1',
        courthouse_name: 'Swansea',
        hearing_date: '2022-01-03',
        start_ts: '2023-08-21T09:00:00Z',
        end_ts: '2023-08-21T10:00:00Z',
        media_request_status: 'OPEN',
        request_type: 'PLAYBACK',
        hearing_id: 1,
      },
      {
        case_id: 2,
        media_request_id: 2,
        case_number: 'C2',
        courthouse_name: 'Swansea',
        hearing_date: '2022-01-03',
        start_ts: '2023-08-21T09:00:00Z',
        end_ts: '2023-08-21T10:00:00Z',
        media_request_status: 'FAILED',
        request_type: 'PLAYBACK',
        hearing_id: 2,
      },
    ],
    transformed_media_details: [
      {
        case_id: 3,
        media_request_id: 3,
        case_number: 'C3',
        courthouse_name: 'Cardiff',
        hearing_date: '2022-01-04',
        start_ts: '2022-01-04T09:00:00Z',
        end_ts: '2022-01-04T10:00:00Z',
        transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
        media_request_status: 'COMPLETED',
        request_type: 'PLAYBACK',
        last_accessed_ts: '',
        transformed_media_filename: 'C3',
        transformed_media_format: 'MP3',
        transformed_media_id: 3,
        hearing_id: 3,
      },
    ],
  };

  const MOCK_EXPIRED_MEDIA_REQUESTS: RequestedMedia = {
    media_request_details: [],
    transformed_media_details: [
      {
        case_id: 4,
        media_request_id: 4,
        case_number: 'C4',
        courthouse_name: 'Cardiff',
        hearing_date: '2022-01-04',
        start_ts: '2022-01-04T09:00:00Z',
        end_ts: '2022-01-04T10:00:00Z',
        transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
        media_request_status: 'COMPLETED',
        request_type: 'PLAYBACK',
        last_accessed_ts: '2022-01-04T09:00:00Z',
        transformed_media_filename: 'C4',
        transformed_media_format: 'MP3',
        transformed_media_id: 4,
        hearing_id: 4,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AudioRequestService],
    });

    service = TestBed.inject(AudioRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('API requests', () => {
    afterEach(() => {
      httpMock.verify();
    });
    describe('#getAudioRequests', () => {
      it('gets audio requests that are not expired', () => {
        service.getAudioRequests(false).subscribe((audios) => {
          expect(audios).toEqual(MOCK_MEDIA_REQUESTS);
        });

        const req = httpMock.expectOne('api/audio-requests/v2?expired=false');
        expect(req.request.method).toBe('GET');

        req.flush(MOCK_MEDIA_REQUESTS);
      });

      it('gets audio requests that are expired', () => {
        let audios;

        service.getAudioRequests(true).subscribe((result) => {
          audios = result;
        });

        const req = httpMock.expectOne('api/audio-requests/v2?expired=true');
        expect(req.request.method).toBe('GET');

        req.flush(MOCK_EXPIRED_MEDIA_REQUESTS);

        expect(audios).toEqual({
          media_request_details: [],
          transformed_media_details: MOCK_EXPIRED_MEDIA_REQUESTS.transformed_media_details.map((ar) => ({
            ...ar,
            hearing_date: ar.hearing_date + 'T00:00:00Z',
          })),
        });
      });

      it('should emit audio requests periodically', fakeAsync(() => {
        const audioSpy = jest.spyOn(service, 'getAudioRequests').mockReturnValue(of(MOCK_MEDIA_REQUESTS));

        service.audioRequests$.subscribe();

        tick();

        expect(audioSpy).toHaveBeenCalledTimes(1);
        expect(audioSpy).toHaveBeenCalledWith(false);

        tick(60 * 1000);

        expect(audioSpy).toHaveBeenCalledTimes(2);
        expect(audioSpy).toHaveBeenCalledWith(false);

        tick(60 * 1000);

        expect(audioSpy).toHaveBeenCalledTimes(3);
        expect(audioSpy).toHaveBeenCalledWith(false);
        discardPeriodicTasks();
      }));

      it('updates unread count', fakeAsync(() => {
        jest.spyOn(service, 'getAudioRequests').mockReturnValue(of(MOCK_MEDIA_REQUESTS));

        const countSpy = jest.spyOn(service['countService'], 'setUnreadAudioCount');

        service.audioRequests$.subscribe();

        tick();

        expect(countSpy).toHaveBeenCalledTimes(1);
        expect(countSpy).toHaveBeenCalledWith(1);
        discardPeriodicTasks();
      }));
    });

    describe('#deleteAudioRequests', () => {
      it('sends delete request', () => {
        const reqId = 123449;
        let responseStatus;
        service.deleteAudioRequests(reqId).subscribe((res) => {
          responseStatus = res.status;
        });

        const req = httpMock.expectOne(`api/audio-requests/${reqId}`);
        expect(req.request.method).toBe('DELETE');

        req.flush(null, { status: 204, statusText: '' });

        expect(responseStatus).toEqual(204);
      });
    });

    describe('#deleteTransformedMedia', () => {
      it('sends delete request', () => {
        const reqId = 123449;
        let responseStatus;
        service.deleteTransformedMedia(reqId).subscribe((res) => {
          responseStatus = res.status;
        });

        const req = httpMock.expectOne(`api/audio-requests/transformed_media/${reqId}`);
        expect(req.request.method).toBe('DELETE');

        req.flush(null, { status: 204, statusText: '' });

        expect(responseStatus).toEqual(204);
      });
    });

    describe('#patchAudioRequestLastAccess', () => {
      it('sends patch request', () => {
        const reqId = 123449;
        let responseStatus;
        service.patchAudioRequestLastAccess(reqId, true).subscribe((res) => {
          responseStatus = res.status;
        });

        const req = httpMock.expectOne(`api/audio-requests/transformed_media/${reqId}`);
        expect(req.request.method).toBe('PATCH');

        req.flush(null, { status: 204, statusText: '' });

        expect(responseStatus).toEqual(204);
      });
    });
  });

  it('expiredAudioRequests$ should call getAudioRequests', fakeAsync(() => {
    const audioSpy = jest.spyOn(service, 'getAudioRequests');

    service.expiredAudioRequests$.subscribe();

    tick();

    expect(audioSpy).toHaveBeenCalledTimes(1);
    expect(audioSpy).toHaveBeenCalledWith(true);
    discardPeriodicTasks();
  }));

  it('#downloadAudio', () => {
    const requestId = 123449;
    const mockBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
    jest.spyOn(service['http'], 'get').mockReturnValueOnce(of(mockBlob));

    let receivedBlob: Blob | undefined;
    service.downloadAudio(requestId, 'DOWNLOAD').subscribe((blob: Blob) => {
      receivedBlob = blob;
    });

    const expectedUrl = `api/audio-requests/download`;
    expect(service['http'].get).toHaveBeenCalledWith(expectedUrl, {
      params: { media_request_id: requestId },
      responseType: 'blob',
    });

    expect(receivedBlob).toBeInstanceOf(Blob);
  });

  describe('#getStatusCode', () => {
    it('should return the status code of the HTTP response', () => {
      const url = '/api';
      const statusCode = 200;

      service.getStatusCode(url).subscribe((result) => {
        expect(result).toEqual(statusCode);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('HEAD');

      req.flush(null, { status: statusCode, statusText: 'OK' });
    });

    it('should return the status code of the HTTP error response', () => {
      const url = '/api';
      const statusCode = 404;

      service.getStatusCode(url).subscribe((result) => {
        expect(result).toEqual(statusCode);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('HEAD');

      req.flush(null, { status: statusCode, statusText: 'Not Found' });
    });

    it('should return the status code of the HTTP error response when an error occurs', () => {
      const url = '/api';
      const statusCode = 500;

      service.getStatusCode(url).subscribe((result) => {
        expect(result).toEqual(statusCode);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('HEAD');

      req.error(new ErrorEvent('Internal Server Error'));
    });
  });
});
