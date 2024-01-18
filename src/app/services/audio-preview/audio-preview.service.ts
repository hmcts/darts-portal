import { Injectable, inject } from '@angular/core';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { Observable } from 'rxjs/internal/Observable';

export const audioPreviewPath = '/api/audio/preview5/';

@Injectable({
  providedIn: 'root',
})
export class AudioPreviewService {
  audioService = inject(AudioRequestService);

  getAudioPreviewBlobUrl(mediaId: number): Observable<string> {
    const url = audioPreviewPath + mediaId.toString();
    return new Observable((observer) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/EventSource
      // SSE protocol used to keep the connection open and receive the audio data
      // This is to overcome the 30 second timeout on Azure FD

      const eventSource = new EventSource(url);

      // Listen for the 'response' event, parse the data
      // This downloads the full audio file as a blob and creates a local URL for it
      eventSource.addEventListener('response', (message) => {
        const responsedata = JSON.parse(message.data);
        const responseBody = responsedata.body;
        const blob = this.b64toBlob(responseBody);
        const blobUrl = window.URL.createObjectURL(blob);
        observer.next(blobUrl);
      });

      eventSource.onerror = () => {
        if (eventSource.readyState !== eventSource.CONNECTING) {
          console.log('error', url);
          observer.error(url);
        }
        eventSource.close();
      };
      return () => {
        eventSource.close();
        observer.complete();
      };
    });
  }

  b64toBlob(b64Data: string) {
    const contentType = 'audio/mpeg';
    const sliceSize = 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
