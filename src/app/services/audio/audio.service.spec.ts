import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { UserState } from '@darts-types/user-state';

describe('AudioService', () => {
  let service: AudioService;
  let httpMock: HttpTestingController;

  const MOCK_AUDIO_REQUESTS: UserAudioRequest[] = [
    {
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
    req$: of(userState),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AudioService, { provide: UserService, useValue: userServiceStub }],
    });

    service = TestBed.inject(AudioService);
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

        service.getAudioRequestsForUser(123, false).subscribe((audios) => {
          expect(audios).toEqual(mockAudios);
        });

        const req = httpMock.expectOne('api/audio-requests?expired=false');
        expect(req.request.method).toBe('GET');

        req.flush(mockAudios);
      });

      it('gets audio requests that are expired', () => {
        const mockAudios: UserAudioRequest[] = MOCK_EXPIRED_AUDIO_REQUESTS;

        service.getAudioRequestsForUser(123, true).subscribe((audios) => {
          expect(audios).toEqual(mockAudios);
        });

        const req = httpMock.expectOne('api/audio-requests?expired=true');
        expect(req.request.method).toBe('GET');

        req.flush(mockAudios);
      });
    });

    describe('#patchAudioRequest', () => {
      it('sends patch request', () => {
        const reqId = 123449;
        service.patchAudioRequest(reqId).subscribe((res) => {
          expect(res.status).toEqual(204);
        });

        const req = httpMock.expectOne(`api/audio-requests/${reqId}`);
        expect(req.request.method).toBe('PATCH');
      });
    });
  });

  describe('constructor', () => {
    it('audioRequests$ subscribe should call getAudioRequestsForUser and update unread count', () => {
      const audioSpy = jest.spyOn(service, 'getAudioRequestsForUser');
      const unreadSpy = jest.spyOn(service, 'updateUnread');

      service.audioRequests$.subscribe(() => {
        expect(audioSpy).toHaveBeenCalledTimes(1);
        expect(unreadSpy).toHaveBeenCalledTimes(1);
        expect(audioSpy).toHaveBeenCalledWith(123, false);
        expect(service.unreadCount$).toEqual(of(5));
      });
    });

    it('expiredAudioRequests$ subscribe should call getAudioRequestsForUser once', () => {
      const audioSpy = jest.spyOn(service, 'getAudioRequestsForUser');

      service.expiredAudioRequests$.subscribe(() => {
        expect(audioSpy).toHaveBeenCalledTimes(1);
        expect(audioSpy).toHaveBeenCalledWith(123, true);
      });
    });
  });

  describe('#updateUnread', () => {
    it('should filter only complete requests', () => {
      const filterSpy = jest.spyOn(service, 'filterCompletedRequests');
      const mockAudios: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;
      service.updateUnread(mockAudios);

      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(service.unreadCount$).toEqual(of(5));
    });
  });

  describe('#filterCompletedRequests', () => {
    it('should filter only complete requests', () => {
      const mockAudios: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;
      const completeAudios = service.filterCompletedRequests(mockAudios);
      expect(completeAudios.length).toBe(6);
    });
  });

  describe('#getUnreadCount', () => {
    it('should return number of unread count', () => {
      const mockAudios: UserAudioRequest[] = MOCK_AUDIO_REQUESTS;
      const completeAudios = service.filterCompletedRequests(mockAudios);
      const unreadCount = service.getUnreadCount(completeAudios);
      expect(unreadCount).toBe(5);
    });
  });
});
