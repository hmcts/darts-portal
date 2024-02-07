import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HearingAudio, HearingEvent, PostAudioRequest } from '@portal-types/index';
import { HearingService } from './hearing.service';

describe('HearingService', () => {
  let service: HearingService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HearingService],
    });
    service = TestBed.inject(HearingService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getEvents', () => {
    it('should get events', () => {
      const hearingId = '123';
      const mockEvents: HearingEvent[] = [];
      let events!: HearingEvent[];

      service.getEvents(hearingId).subscribe((eventsResponse) => (events = eventsResponse));

      const req = httpTestingController.expectOne(`api/hearings/${hearingId}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);

      expect(events).toEqual(mockEvents);
    });

    it('handle 404 and return empty array', () => {
      const hearingId = '123';
      let events!: HearingEvent[];

      service.getEvents(hearingId).subscribe((eventsResponse) => (events = eventsResponse));

      const req = httpTestingController.expectOne(`api/hearings/${hearingId}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(events).toEqual([]);
    });

    it('should re-throw error if not 404', () => {
      const hearingId = '123';
      let error!: HttpErrorResponse;

      service.getEvents(hearingId).subscribe({ error: (err: HttpErrorResponse) => (error = err) });

      const req = httpTestingController.expectOne(`api/hearings/${hearingId}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Server Error' });

      expect(error.status).toEqual(500);
      expect(error.statusText).toEqual('Server Error');
    });
  });

  describe('#getAudio', () => {
    it('should get audio', () => {
      const hearingId = '123';
      const mockAudio: HearingAudio[] = [];
      let audio!: HearingAudio[];

      service.getAudio(hearingId).subscribe((audioResponse) => (audio = audioResponse));

      const req = httpTestingController.expectOne(`api/audio/hearings/${hearingId}/audios`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAudio);

      expect(audio).toEqual(mockAudio);
    });

    it('handle 404 and return empty array', () => {
      const hearingId = '123';
      let audio!: HearingAudio[];

      service.getAudio(hearingId).subscribe((audioResponse) => (audio = audioResponse));

      const req = httpTestingController.expectOne(`api/audio/hearings/${hearingId}/audios`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(audio).toEqual([]);
    });

    it('should re-throw error if not 404', () => {
      const hearingId = '123';
      let error!: HttpErrorResponse;

      service.getAudio(hearingId).subscribe({ error: (err: HttpErrorResponse) => (error = err) });

      const req = httpTestingController.expectOne(`api/audio/hearings/${hearingId}/audios`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Server Error' });

      expect(error.status).toEqual(500);
      expect(error.statusText).toEqual('Server Error');
    });
  });

  describe('#requestAudio', () => {
    it('should request audio', () => {
      let response;
      const audioRequest: PostAudioRequest = {
        hearing_id: 1,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      const mockResponse = {
        request_id: 141,
        case_id: 'DMP461_Case12',
        courthouse_name: 'LIVERPOOL_DMP461',
        hearing_date: '2023-08-11',
        start_time: '2023-08-11T15:30:17Z',
        end_time: '2023-08-11T15:30:17Z',
      };

      service.requestAudio(audioRequest).subscribe((res) => (response = res));

      const req = httpTestingController.expectOne((request) => {
        return request.body === audioRequest && request.url === 'api/audio-requests';
      });
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(response).toEqual(mockResponse);
    });
  });
});
