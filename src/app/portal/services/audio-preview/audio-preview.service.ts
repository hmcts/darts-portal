import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, interval, map, of, switchMap, takeWhile } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export const audioPreviewPath = '/api/audio/preview/';

@Injectable({
  providedIn: 'root',
})
export class AudioPreviewService {
  http = inject(HttpClient);

  isAudioPreviewReady(mediaId: number): Observable<number> {
    const url = audioPreviewPath + mediaId.toString();

    return this.http.head(url, { observe: 'response' }).pipe(
      switchMap((response: HttpResponse<unknown>) => {
        if (response.status === 200) {
          return of(response.status);
        } else {
          return interval(5000).pipe(
            switchMap(() => this.http.head(url, { observe: 'response' })),
            map((response: HttpResponse<unknown>) => {
              return response.status;
            }),
            takeWhile((code) => code === 202, true),
            catchError((error: HttpResponse<unknown>) => of(error.status))
          );
        }
      }),
      catchError((error: HttpResponse<unknown>) => of(error.status))
    );
  }
}
