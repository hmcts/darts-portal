import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranscriptRequestCounts } from '@portal-types/index';
import { of } from 'rxjs';
import {
  CountNotificationService,
  TRANSCRIPTION_COUNT_PATH,
  UNREAD_AUDIO_COUNT_PATH,
} from './count-notification.service';

const THIRTY_SECONDS = 30000;

describe('CountNotificationService', () => {
  let service: CountNotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CountNotificationService],
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

  it('should fetch transcript counts', fakeAsync(() => {
    const mockCounts: TranscriptRequestCounts = { assigned: 5, unassigned: 3 };

    service.getTranscriptCount().subscribe((counts) => expect(counts).toEqual(mockCounts));

    const req = httpMock.expectOne({ url: TRANSCRIPTION_COUNT_PATH, method: 'GET' });
    req.flush(mockCounts);
    tick();
  }));

  it('should fetch unread audio count', fakeAsync(() => {
    const mockCount = { count: 10 };

    service.getUnreadAudioCount().subscribe((count) => expect(count).toBe(10));

    const req = httpMock.expectOne({ url: UNREAD_AUDIO_COUNT_PATH, method: 'GET' });
    req.flush(mockCount);
    tick();
  }));

  it('should decrement unread audio count', fakeAsync(() => {
    service.setUnreadAudioCount(5);
    service.decrementUnreadAudioCount();

    service.unreadAudio$.subscribe((count) => expect(count).toBe(4)).unsubscribe();
    tick();
  }));

  it('should decrement unassigned transcript count', fakeAsync(() => {
    service.setTranscriptCounts({ assigned: 5, unassigned: 3 });
    service.decrementUnassignedTranscriptCount();

    service.transcriptCount$.subscribe((counts) => expect(counts.unassigned).toBe(2)).unsubscribe();
    tick();
  }));

  it('should decrement assigned transcript count', fakeAsync(() => {
    service.setTranscriptCounts({ assigned: 5, unassigned: 3 });
    service.decrementAssignedTranscriptCount();

    service.transcriptCount$.subscribe((counts) => expect(counts.assigned).toBe(4)).unsubscribe();
    tick();
  }));

  it('should increment assigned transcript count', fakeAsync(() => {
    service.setTranscriptCounts({ assigned: 5, unassigned: 3 });
    service.incrementAssignedTranscriptCount();

    service.transcriptCount$.subscribe((counts) => expect(counts.assigned).toBe(6)).unsubscribe();
    tick();
  }));

  it('should set unread audio count', fakeAsync(() => {
    service.setUnreadAudioCount(44);
    service.unreadAudio$.subscribe((count) => expect(count).toBe(44)).unsubscribe();
    tick();
  }));

  it('should set assigned transcript count', fakeAsync(() => {
    service.setTranscriptCounts({ assigned: 5, unassigned: 3 });
    service.setAssignedTranscriptCount(9);

    service.transcriptCount$.subscribe((counts) => expect(counts.assigned).toBe(9)).unsubscribe();
    tick();
  }));

  it('should set unassigned transcript count', fakeAsync(() => {
    service.setTranscriptCounts({ assigned: 5, unassigned: 3 });
    service.setUnassignedTranscriptCount(9);

    service.transcriptCount$.subscribe((counts) => expect(counts.unassigned).toBe(9)).unsubscribe();
    tick();
  }));

  it('should set transcript counts', fakeAsync(() => {
    service.setTranscriptCounts({ assigned: 5, unassigned: 3 });

    service.transcriptCount$
      .subscribe((counts) => expect(counts).toEqual({ assigned: 5, unassigned: 3 }))
      .unsubscribe();
    tick();
  }));

  it('should poll unread audio counts every 30 seconds', fakeAsync(() => {
    jest
      .spyOn(service, 'getUnreadAudioCount')
      .mockReturnValueOnce(of(10))
      .mockReturnValueOnce(of(20))
      .mockReturnValueOnce(of(30));

    let count = 0;

    const sub = service.unreadAudio$.subscribe((c) => (count = c));

    tick();

    expect(count).toBe(10);

    tick(THIRTY_SECONDS); // simulate 30 seconds

    expect(count).toBe(20);

    tick(THIRTY_SECONDS);

    expect(count).toBe(30);

    sub.unsubscribe();
  }));

  it('should poll transcript counts every 30 seconds', fakeAsync(() => {
    jest
      .spyOn(service, 'getTranscriptCount')
      .mockReturnValueOnce(of({ assigned: 5, unassigned: 3 }))
      .mockReturnValueOnce(of({ assigned: 6, unassigned: 4 }))
      .mockReturnValueOnce(of({ assigned: 7, unassigned: 5 }));

    let counts: TranscriptRequestCounts = { assigned: 0, unassigned: 0 };

    const sub = service.transcriptCount$.subscribe((c) => (counts = c));

    tick();

    expect(counts).toEqual({ assigned: 5, unassigned: 3 });

    tick(THIRTY_SECONDS);

    expect(counts).toEqual({ assigned: 6, unassigned: 4 });

    tick(THIRTY_SECONDS);

    expect(counts).toEqual({ assigned: 7, unassigned: 5 });

    sub.unsubscribe();
  }));
});
