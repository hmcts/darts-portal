import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AudioRequestType,
  RequestedMedia,
  RequestedMediaData,
  TransformedMedia,
} from '@darts-types/requested-media.interface';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { DateTime } from 'luxon';
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
    tap((requests) => this.updateUnreadAudioCount(requests.transformedMedia))
  );

  expiredAudioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(switchMap(() => this.getAudioRequests(true)));

  getAudioRequests(expired: boolean): Observable<RequestedMedia> {
    return this.http
      .get<RequestedMediaData>(`api/audio-requests/v2`, {
        params: { expired },
      })
      .pipe(map((requestedMediaData) => this.mapRequestedMediaData(requestedMediaData)));
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
    const count = media.filter((m) => !m.lastAccessedTs).length;
    this.countService.setUnreadAudioCount(count);
  }

  private mapRequestedMediaData(requestedMediaData: RequestedMediaData): RequestedMedia {
    return {
      mediaRequests: requestedMediaData.media_request_details
        ? requestedMediaData.media_request_details.map((mediaRequest) => ({
            caseId: mediaRequest.case_id,
            mediaRequestId: mediaRequest.media_request_id,
            caseNumber: mediaRequest.case_number,
            courthouseName: mediaRequest.courthouse_name,
            hearingId: mediaRequest.hearing_id,
            hearingDate: DateTime.fromISO(mediaRequest.hearing_date),
            startTime: DateTime.fromISO(mediaRequest.start_ts),
            endTime: DateTime.fromISO(mediaRequest.end_ts),
            status: mediaRequest.media_request_status,
            requestType: mediaRequest.request_type,
          }))
        : [],
      transformedMedia: requestedMediaData.transformed_media_details.map((transformedMedia) => ({
        caseId: transformedMedia.case_id,
        mediaRequestId: transformedMedia.media_request_id,
        caseNumber: transformedMedia.case_number,
        courthouseName: transformedMedia.courthouse_name,
        hearingId: transformedMedia.hearing_id,
        hearingDate: DateTime.fromISO(transformedMedia.hearing_date),
        startTime: DateTime.fromISO(transformedMedia.start_ts),
        endTime: DateTime.fromISO(transformedMedia.end_ts),
        status: transformedMedia.media_request_status,
        requestType: transformedMedia.request_type,
        transformedMediaId: transformedMedia.transformed_media_id,
        transformedMediaFilename: transformedMedia.transformed_media_filename,
        transformedMediaFormat: transformedMedia.transformed_media_format,
        transformedMediaExpiryTs: DateTime.fromISO(transformedMedia.transformed_media_expiry_ts),
        lastAccessedTs: transformedMedia.last_accessed_ts
          ? DateTime.fromISO(transformedMedia.last_accessed_ts)
          : undefined,
      })),
    };
  }
}
