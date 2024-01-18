import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AudioPreviewService } from './audio-preview.service';

describe('AudioPreviewService', () => {
  let service: AudioPreviewService;

  beforeEach(() => {
    // Mock URL.createObjectURL()
    (window.URL as any) = {
      createObjectURL: jest.fn(() => 'mocked blob url'),
    };

    (window as any).EventSource = class EventSource {
      // Define the methods and properties you need to mock here
      onmessage = jest.fn();
      onerror = jest.fn();
      close = jest.fn();
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AudioPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a blob from a base64 string', () => {
    const b64Data =
      'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAAA//8AAAAyYWRtaW5pc3RyYXRvcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const blob = service.b64toBlob(b64Data);
    expect(blob).toBeTruthy();
    expect(blob.type).toBe('audio/mpeg');
  });

  it('should connect with an EventSource', () => {
    const mediaId = 123;
    const url = '/api/audio/preview5/123';
    const eventSourceMock = {
      addEventListener: jest.fn(),
      close: jest.fn(),
      onerror: jest.fn(),
    } as unknown as EventSource;

    jest.spyOn(window, 'EventSource').mockReturnValue(eventSourceMock);

    service.getAudioPreviewBlobUrl(mediaId).subscribe();

    expect(window.EventSource).toHaveBeenCalledWith(url);
  });

  it('should close the EventSource on unsubscribe', () => {
    const mediaId = 123;
    const eventSourceMock = {
      addEventListener: jest.fn(),
      close: jest.fn(),
      onerror: jest.fn(),
    } as unknown as EventSource;

    jest.spyOn(window, 'EventSource').mockReturnValue(eventSourceMock);

    const subscription = service.getAudioPreviewBlobUrl(mediaId).subscribe();
    subscription.unsubscribe();

    expect(eventSourceMock.close).toHaveBeenCalled();
  });
});
