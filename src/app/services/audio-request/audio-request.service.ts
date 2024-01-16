import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AudioRequestType, RequestedMedia, TransformedMedia } from '@darts-types/requested-media.interface';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { Observable, catchError, map, of, switchMap, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioRequestService {
  http = inject(HttpClient);
  countService = inject(CountNotificationService);

  // Defined in seconds
  private readonly POLL_INTERVAL = 60;

  audioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(
    switchMap(() => this.getAudioRequests(false)),
    tap((requests) => this.updateUnreadAudioCount(requests.transformed_media_details))
  );

  expiredAudioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(switchMap(() => this.getAudioRequests(true)));

  getAudioRequests(expired: boolean): Observable<RequestedMedia> {
    return this.http
      .get<RequestedMedia>(`api/audio-requests/v2`, {
        params: { expired },
      })
      .pipe(map(this.convertHearingDateToUtc));
  }

  deleteAudioRequests(mediaRequestId: number): Observable<HttpResponse<Response>> {
    return this.http.delete<Response>(`api/audio-requests/${mediaRequestId}`, { observe: 'response' });
  }

  deleteTransformedMedia(transformedMediaId: number): Observable<HttpResponse<Response>> {
    return this.http.delete<Response>(`api/audio-requests/transformed_media/${transformedMediaId}`, {
      observe: 'response',
    });
  }

  //Sends request to update last accessed timestamp
  patchAudioRequestLastAccess(transformedMediaId: number, isUnread = false): Observable<HttpResponse<Response>> {
    return this.http
      .patch<Response>(`api/audio-requests/transformed_media/${transformedMediaId}`, {}, { observe: 'response' })
      .pipe(
        tap(() => {
          if (isUnread) {
            // Optimistically update the unread count before next polling interval
            this.countService.decrementUnreadAudioCount();
          }
        })
      );
  }

  downloadAudio(transformedMediaId: number, requestType: AudioRequestType): Observable<Blob> {
    // api/audio-requests/{playback | download}?media_request_id={requestId}
    return this.http.get(`api/audio-requests/${requestType.toLowerCase()}`, {
      params: { transformed_media_id: transformedMediaId },
      responseType: 'blob',
    });
  }

  getStatusCode(url: string): Observable<number> {
    return this.http.head(url, { observe: 'response' }).pipe(
      map((response) => response.status),
      catchError((error: HttpErrorResponse) => {
        return of(error.status);
      })
    );
  }

  private updateUnreadAudioCount(media: TransformedMedia[]) {
    const count = media.filter((m) => !m.last_accessed_ts).length;
    this.countService.setUnreadAudioCount(count);
  }

  private convertHearingDateToUtc(requestedMedia: RequestedMedia) {
    return {
      media_request_details: requestedMedia.media_request_details
        ? requestedMedia.media_request_details.map((r) => ({
            ...r,
            hearing_date: r.hearing_date + 'T00:00:00Z',
          }))
        : [], // If there are no media requests, return an empty array
      transformed_media_details: requestedMedia.transformed_media_details.map((r) => ({
        ...r,
        hearing_date: r.hearing_date + 'T00:00:00Z',
      })),
    };
  }
}
