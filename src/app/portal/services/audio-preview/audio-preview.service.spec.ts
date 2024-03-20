import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AudioPreviewService, audioPreviewPath } from './audio-preview.service';

describe('AudioPreviewService', () => {
  let service: AudioPreviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AudioPreviewService],
    });

    service = TestBed.inject(AudioPreviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return immediately with status 200', () => {
    const mediaId = 123;
    service.isAudioPreviewReady(mediaId).subscribe((status) => {
      expect(status).toEqual(200);
    });

    const req = httpMock.expectOne(`${audioPreviewPath}${mediaId}`);
    expect(req.request.method).toEqual('HEAD');
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should poll until status is not 202', fakeAsync(() => {
    const mediaId = 1;
    const receivedStatuses: number[] = [];

    service.isAudioPreviewReady(mediaId).subscribe((status) => {
      receivedStatuses.push(status);
    });

    const req = httpMock.match(`${audioPreviewPath}${mediaId}`);
    req[0].flush({}, { status: 202, statusText: 'Accepted' });
    tick(5000); // Simulate the time delay for the polling interval.

    //Required due to the startWith(0) in polling
    const req1 = httpMock.match(`${audioPreviewPath}${mediaId}`);
    req1[1].flush({}, { status: 202, statusText: 'Accepted' });
    tick(5000);

    const req2 = httpMock.expectOne(`${audioPreviewPath}${mediaId}`);
    req2.flush({}, { status: 202, statusText: 'Accepted' });
    tick(5000);

    const req3 = httpMock.expectOne(`${audioPreviewPath}${mediaId}`);
    req3.flush({}, { status: 200, statusText: 'OK' });
    flush();

    expect(receivedStatuses).toEqual([202, 202, 200]);
  }));

  it('should return the error status when an error occurs', fakeAsync(() => {
    const mediaId = 123;
    const errorStatus = 500; // Simulate an internal server error
    let receivedStatus: number | undefined;

    service.isAudioPreviewReady(mediaId).subscribe({
      next: (status) => {
        receivedStatus = status;
      },
    });

    // Expect the initial request and respond with an error
    const req = httpMock.expectOne(`${audioPreviewPath}${mediaId}`);
    // Use req.error to simulate an error response.
    const errorEvent = new ProgressEvent('Network error');
    req.error(errorEvent, { status: errorStatus });

    tick();

    expect(receivedStatus).toBe(errorStatus);

    flush();
  }));
});
