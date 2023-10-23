import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { UserState } from '@darts-types/user-state';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { AudioRequestService } from './audio-request.service';

describe('AudioService', () => {
  let service: AudioRequestService;
  let httpMock: HttpTestingController;

  const MOCK_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
      case_id: 2,
      media_request_id: 12345,
      case_number: 'T20200190',
      courthouse_name: 'Manchester Minshull Street',
      hearing_date: '2023-10-03',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'OPEN',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      case_id: 3,
      media_request_id: 12346,
      case_number: 'T2020019210',
      courthouse_name: 'Reading',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'PROCESSING',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      case_id: 4,
      media_request_id: 12347,
      case_number: 'T20200192222',
      courthouse_name: 'Slough',
      hearing_date: '2023-11-12',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'OPEN',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      case_id: 5,
      media_request_id: 12347,
      case_number: 'T20200192231',
      courthouse_name: 'Brighton',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'FAILED',
    },
    {
      case_id: 6,
      media_request_id: 12378,
      case_number: 'T20200331',
      courthouse_name: 'Liverpool',
      hearing_date: '2023-10-04',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      case_id: 7,
      media_request_id: 12377,
      case_number: 'T20200333',
      courthouse_name: 'Liverpool',
      hearing_date: '2023-10-04',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
      last_accessed_ts: '2023-08-23T09:00:00Z',
    },
    {
      case_id: 8,
      media_request_id: 12342,
      case_number: 'T2020011820',
      courthouse_name: 'Ascot',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      case_id: 9,
      media_request_id: 12341,
      case_number: 'T2023453422',
      courthouse_name: 'Bournemouth',
      hearing_date: '2023-11-15',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      case_id: 10,
      media_request_id: 123443,
      case_number: 'T20200192231',
      courthouse_name: 'Brighton',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
    {
      case_id: 11,
      media_request_id: 123449,
      case_number: 'T202001922310202',
      courthouse_name: 'Swindon',
      hearing_date: '2023-11-13',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'COMPLETED',
    },
  ];

  const MOCK_EXPIRED_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
      case_id: 12,
      media_request_id: 12311,
      case_number: 'T20202110',
      courthouse_name: 'Manchester Minshull Street',
      hearing_date: '2023-10-13',
      media_request_start_ts: '2023-08-21T09:00:00Z',
      media_request_end_ts: '2023-08-21T10:00:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'EXPIRED',
    },
    {
      case_id: 13,
      media_request_id: 123123,
      case_number: 'T202001232',
      courthouse_name: 'Reading',
      hearing_date: '2023-11-21',
      media_request_start_ts: '2023-08-21T09:08:00Z',
      media_request_end_ts: '2023-08-21T10:14:00Z',
      media_request_expiry_ts: '2023-08-23T09:00:00Z',
      media_request_status: 'EXPIRED',
    },
    {
      case_id: 14,
      media_request_id: 4321,
      case_number: 'T20200192772',
      courthouse_name: 'Slough',
      hearing_date: '2023-11-28',
      media_request_start_ts: '2023-08-21T09:57:00Z',
      media_request_end_ts: '2023-08-21T10:43:00Z',
      media_request_expiry_ts: '2023-11-23T09:00:00Z',
      media_request_status: 'EXPIRED',
    },
  ];

  const userState: UserState = { userName: 'test@test.com', userId: 123, roles: [] };
  const userServiceStub = {
    userProfile$: of(userState),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AudioRequestService, { provide: UserService, useValue: userServiceStub }],
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
    describe('#getAudioRequestsForUser', () => {
      it('gets audio requests that are not expired', () => {
        const mockAudios: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;

        service.getAudioRequests(false).subscribe((audios) => {
          expect(audios).toEqual(mockAudios);
        });

        const req = httpMock.expectOne('api/audio-requests?expired=false');
        expect(req.request.method).toBe('GET');

        req.flush(mockAudios);
      });

      it('gets audio requests that are expired', () => {
        const mockAudios: UserAudioRequest[] = MOCK_EXPIRED_AUDIO_REQUESTS;

        let audios;

        service.getAudioRequests(true).subscribe((result) => {
          audios = result;
        });

        const req = httpMock.expectOne('api/audio-requests?expired=true');
        expect(req.request.method).toBe('GET');

        req.flush(mockAudios);

        expect(audios).toEqual(mockAudios.map((ar) => ({ ...ar, hearing_date: ar.hearing_date + 'Z' })));
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

    describe('#patchAudioRequest', () => {
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

  it('audioRequests$ should getAudioRequests and update unread count', fakeAsync(() => {
    const getAudioRequestsSpy = jest.spyOn(service, 'getAudioRequests');

    service.audioRequests$.subscribe();

    tick();

    expect(getAudioRequestsSpy).toHaveBeenCalledTimes(1);
    expect(getAudioRequestsSpy).toHaveBeenCalledWith(false);
    discardPeriodicTasks();
  }));

  it('expiredAudioRequests$ should call getAudioRequests', fakeAsync(() => {
    const audioSpy = jest.spyOn(service, 'getAudioRequests');

    service.expiredAudioRequests$.subscribe();

    tick();

    expect(audioSpy).toHaveBeenCalledTimes(1);
    expect(audioSpy).toHaveBeenCalledWith(true);
    discardPeriodicTasks();
  }));

  // describe('#updateUnread', () => {
  //   it('should filter only complete requests', fakeAsync(() => {
  //     const filterSpy = jest.spyOn(service, 'filterCompletedRequests');
  //     const mockAudios: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;
  //     let count!: number;
  //     service(mockAudios);

  //     service.unreadCount$.subscribe((result) => (count = result));

  //     tick();

  //     expect(filterSpy).toHaveBeenCalledWith(mockAudios);
  //     expect(count).toEqual(5);
  //     discardPeriodicTasks();
  //   }));
  // });

  it('#filterCompletedRequests', () => {
    const mockAudios: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;
    const completeAudios = service.filterCompletedRequests(mockAudios);
    expect(completeAudios.length).toBe(6);
  });
});
