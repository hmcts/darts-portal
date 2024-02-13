import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CountNotificationService,
  TRANSCRIPTION_COUNT_PATH,
  UNREAD_AUDIO_COUNT_PATH,
} from './count-notification.service';

describe('CountNotificationService', () => {
  let service: CountNotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountNotificationService],
    });
    service = TestBed.inject(CountNotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should decrement unread audio count', () => {
    const initialValue = 8;
    service.setUnreadAudioCount(initialValue);
    service.decrementUnreadAudioCount();
    service.unreadAudio$.subscribe((count) => {
      expect(count).toBe(initialValue - 1);
    });
  });

  it('should set unread audio count', () => {
    const count = 3;
    service.setUnreadAudioCount(count);
    service.unreadAudio$.subscribe((updatedCount) => {
      expect(updatedCount).toBe(count);
    });
  });

  it('should set assigned transcript count', () => {
    const count = 7;
    service.setAssignedTranscriptCount(count);
    service.assignedTranscripts$.subscribe((updatedCount) => {
      expect(updatedCount).toBe(count);
    });
  });

  it('should set unassigned transcript count', () => {
    const count = 4;
    service.setUnassignedTranscriptCount(count);
    service.unassignedTranscripts$.subscribe((updatedCount) => {
      expect(updatedCount).toBe(count);
    });
  });

  it('should get assigned transcript count', () => {
    const count = 5;
    service.getAssignedTranscriptCount().subscribe((response) => {
      expect(response).toBe(count);
    });

    const req = httpMock.expectOne(TRANSCRIPTION_COUNT_PATH);
    expect(req.request.method).toBe('GET');
    req.flush({ assigned: count });
  });

  it('should get unassigned transcript count', () => {
    const count = 10;
    service.getUnassignedTranscriptCount().subscribe((response) => {
      expect(response).toBe(count);
    });

    const req = httpMock.expectOne(TRANSCRIPTION_COUNT_PATH);
    expect(req.request.method).toBe('GET');
    req.flush({ unassigned: count });
  });

  it('should get unread audio count', () => {
    const count = 8;
    service.getUnreadAudioCount().subscribe((response) => {
      expect(response).toBe(count);
    });

    const req = httpMock.expectOne(UNREAD_AUDIO_COUNT_PATH);
    expect(req.request.method).toBe('GET');
    req.flush({ count });
  });
});
