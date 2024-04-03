import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { PostAudioRequest, RequestedMedia, RequestedMediaData } from '@portal-types/index';
import { DateTime, Settings } from 'luxon';
import { of } from 'rxjs';
import { AudioRequestService } from './audio-request.service';

Settings.defaultZone = 'utc';

describe('AudioService', () => {
  let service: AudioRequestService;
  let httpMock: HttpTestingController;

  const MOCK_MEDIA_REQUESTS: RequestedMedia = {
    mediaRequests: [
      {
        caseId: 1,
        mediaRequestId: 1,
        caseNumber: 'C1',
        courthouseName: 'Swansea',
        hearingDate: DateTime.fromISO('2022-01-03'),
        startTime: DateTime.fromISO('2023-08-21T09:00:00Z'),
        endTime: DateTime.fromISO('2023-08-21T10:00:00Z'),
        status: 'OPEN',
        requestType: 'PLAYBACK',
        hearingId: 1,
      },
      {
        caseId: 2,
        mediaRequestId: 2,
        caseNumber: 'C2',
        courthouseName: 'Swansea',
        hearingDate: DateTime.fromISO('2022-01-03'),
        startTime: DateTime.fromISO('2023-08-21T09:00:00Z'),
        endTime: DateTime.fromISO('2023-08-21T10:00:00Z'),
        status: 'FAILED',
        requestType: 'PLAYBACK',
        hearingId: 2,
      },
    ],
    transformedMedia: [
      {
        caseId: 3,
        mediaRequestId: 3,
        caseNumber: 'C3',
        courthouseName: 'Cardiff',
        hearingDate: DateTime.fromISO('2022-01-04'),
        startTime: DateTime.fromISO('2022-01-04T09:00:00Z'),
        endTime: DateTime.fromISO('2022-01-04T10:00:00Z'),
        transformedMediaExpiryTs: DateTime.fromISO('2022-01-04T09:00:00Z'),
        status: 'COMPLETED',
        requestType: 'PLAYBACK',
        lastAccessedTs: undefined,
        transformedMediaFilename: 'C3.mp3',
        transformedMediaFormat: 'MP3',
        transformedMediaId: 3,
        hearingId: 3,
      },
    ],
  };

  const MOCK_EXPIRED_MEDIA_REQUESTS: RequestedMediaData = {
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
        transformed_media_filename: 'C4.mp3',
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
          mediaRequests: [],
          transformedMedia: [
            {
              caseId: 4,
              caseNumber: 'C4',
              courthouseName: 'Cardiff',
              endTime: DateTime.fromISO('2022-01-04T10:00:00Z'),
              hearingDate: DateTime.fromISO('2022-01-04T00:00:00Z'),
              hearingId: 4,
              lastAccessedTs: DateTime.fromISO('2022-01-04T09:00:00Z'),
              mediaRequestId: 4,
              requestType: 'PLAYBACK',
              startTime: DateTime.fromISO('2022-01-04T09:00:00Z'),
              status: 'COMPLETED',
              transformedMediaExpiryTs: DateTime.fromISO('2022-01-04T09:00:00Z'),
              transformedMediaFilename: 'C4.mp3',
              transformedMediaFormat: 'MP3',
              transformedMediaId: 4,
            },
          ],
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

    describe('#requestAudio', () => {
      it('sends post request', () => {
        const audioRequest: PostAudioRequest = {
          hearing_id: 1,
          requestor: 1,
          start_time: 'string',
          end_time: 'string',
          request_type: 'test',
        };
        service.requestAudio(audioRequest).subscribe();

        const req = httpMock.expectOne(`api/audio-requests/${audioRequest.request_type}`);
        expect(req.request.method).toBe('POST');
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
    const transformedMediaId = 123449;
    const mockBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
    jest.spyOn(service['http'], 'get').mockReturnValueOnce(of(mockBlob));

    let receivedBlob: Blob | undefined;
    service.downloadAudio(transformedMediaId, 'DOWNLOAD').subscribe((blob: Blob) => {
      receivedBlob = blob;
    });

    const expectedUrl = `api/audio-requests/download`;
    expect(service['http'].get).toHaveBeenCalledWith(expectedUrl, {
      params: { transformed_media_id: transformedMediaId },
      responseType: 'blob',
    });

    expect(receivedBlob).toBeInstanceOf(Blob);
  });

  describe('#isAudioPlaybackAvailable', () => {
    it('should return the status code for a successful HEAD request', () => {
      const testUrl = '/test-url';
      const expectedStatus = 200;

      service.isAudioPlaybackAvailable(testUrl).subscribe((status) => {
        expect(status).toEqual(expectedStatus);
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('HEAD');
      req.flush({}, { status: expectedStatus, statusText: 'OK' });
    });

    it('should return the error status code for a failed HEAD request', () => {
      const testUrl = '/test-url';
      const errorStatus = 404;

      service.isAudioPlaybackAvailable(testUrl).subscribe((status) => {
        expect(status).toEqual(errorStatus);
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('HEAD');
      req.flush({}, { status: errorStatus, statusText: 'Not Found' });
    });
  });

  describe('private method - mapRequestedMediaData', () => {
    it('should map requested media data', () => {
      const startTs = DateTime.fromISO('00:00:00');
      const endTs = DateTime.fromISO('01:00:00');
      const hearingDate = DateTime.fromObject({
        year: 2024,
        day: 1,
        month: 1,
      });
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).mapRequestedMediaData({
          media_request_details: [
            {
              case_id: 1,
              case_number: 123,
              media_request_id: 1,
              case_1: 'CASE',
              courthouse_name: 'COURTHOUSENAME',
              hearing_id: 1,
              hearing_date: hearingDate.toISODate(),
              start_ts: startTs.toISO(),
              end_ts: endTs.toISO(),
              media_request_status: 'OPEN',
              request_type: 'PLAYBACK',
            },
          ],
          transformed_media_details: [],
        })
      ).toEqual({
        mediaRequests: [
          {
            caseId: 1,
            caseNumber: 123,
            courthouseName: 'COURTHOUSENAME',
            endTime: endTs,
            hearingDate: hearingDate,
            hearingId: 1,
            mediaRequestId: 1,
            requestType: 'PLAYBACK',
            startTime: startTs,
            status: 'OPEN',
          },
        ],
        transformedMedia: [],
      });
    });
  });
});
