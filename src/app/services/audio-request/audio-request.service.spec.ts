import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { UserAudioRequestRow } from '@darts-types/user-audio-request-row.interface';
import { MediaRequest, MediaRequests } from '@darts-types/user-audio-request.interface';
import { of } from 'rxjs';
import { AudioRequestService } from './audio-request.service';

describe('AudioService', () => {
  let service: AudioRequestService;
  let httpMock: HttpTestingController;

  const MOCK_MEDIA_REQUESTS: MediaRequests = {
    media_request_details: [
      {
        case_id: 1,
        media_request_id: 1,
        case_number: 'C1',
        courthouse_name: 'Swansea',
        hearing_date: '2022-01-03',
        start_ts: '2023-08-21T09:00:00Z',
        end_ts: '2023-08-21T10:00:00Z',
        transformed_media_expiry_ts: '2023-08-23T09:00:00Z',
        media_request_status: 'OPEN',
        request_type: 'PLAYBACK',
        last_accessed_ts: '2023-08-23T09:00:00Z',
        transformed_media_filename: 'C1',
        transformed_media_format: 'MP3',
        transformed_media_id: 1,
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
        transformed_media_expiry_ts: '2023-08-23T09:00:00Z',
        media_request_status: 'FAILED',
        request_type: 'PLAYBACK',
        last_accessed_ts: '2023-08-23T09:00:00Z',
        transformed_media_filename: 'C2',
        transformed_media_format: 'MP3',
        transformed_media_id: 2,
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

  const MOCK_EXPIRED_MEDIA_REQUESTS: MediaRequests = {
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

        const req = httpMock.expectOne('api/audio-requests?expired=false');
        expect(req.request.method).toBe('GET');

        req.flush(MOCK_MEDIA_REQUESTS);
      });

      it('gets audio requests that are expired', () => {
        let audios;

        service.getAudioRequests(true).subscribe((result) => {
          audios = result;
        });

        const req = httpMock.expectOne('api/audio-requests?expired=true');
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
    });

    describe('#deleteAudioRequest', () => {
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

    describe('#patchAudioRequestLastAccess', () => {
      it('sends patch request', () => {
        const reqId = 123449;
        let responseStatus;
        service.patchAudioRequestLastAccess(reqId, true).subscribe((res) => {
          responseStatus = res.status;
        });

        const req = httpMock.expectOne(`api/audio-requests/${reqId}`);
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

  it('#filterCompletedRequests', () => {
    const mockAudios: MediaRequest[] = MOCK_MEDIA_REQUESTS.transformed_media_details;
    const completeAudios = service.filterCompletedRequests(mockAudios);
    expect(completeAudios.length).toBe(1);
  });

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

  it('#setAudioRequest', () => {
    const mockAudioRequest: UserAudioRequestRow = {
      caseId: 123,
      caseNumber: 'T20200190',
      courthouse: 'Manchester Minshull Street',
      hearingId: 123,
      hearingDate: '2023-10-03',
      lastAccessed: '2023-08-23T09:00:00Z',
      startTime: '2023-08-21T09:00:00Z',
      endTime: '2023-08-21T10:00:00Z',
      requestId: 123,
      expiry: '2023-08-23T09:00:00Z',
      status: 'OPEN',
      requestType: 'DOWNLOAD',
      output_filename: 'T20200190',
      output_format: 'zip',
    };
    service.setAudioRequest(mockAudioRequest);
    expect(service.audioRequestView).toEqual(mockAudioRequest);
  });
});
