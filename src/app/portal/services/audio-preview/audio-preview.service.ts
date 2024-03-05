import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { interval, map, of, switchMap, takeWhile } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export const audioPreviewPath = '/api/audio/preview/';

@Injectable({
  providedIn: 'root',
})
export class AudioPreviewService {
  http = inject(HttpClient);

  isAudioPreviewReady(mediaId: number): Observable<boolean> {
    const url = audioPreviewPath + mediaId.toString();
    return this.http.head(url, { observe: 'response' }).pipe(
      switchMap((response: HttpResponse<unknown>) => {
        if (response.status === 200) {
          return of(true);
        } else {
          return interval(5000).pipe(
            switchMap(() => this.http.head(url, { observe: 'response' })),
            map((response: HttpResponse<unknown>) => response.status === 200),
            takeWhile((conditionMet) => !conditionMet, true)
          );
        }
      })
    );
  }
}
