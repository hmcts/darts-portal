import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserAudioRequestRow } from '@darts-types/index';
import { AudioRequestType, MediaRequest, MediaRequests } from '@darts-types/user-audio-request.interface';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioRequestService {
  http = inject(HttpClient);
  countService = inject(CountNotificationService);

  // Defined in seconds
  private readonly POLL_INTERVAL = 60;

  // Store audio request when clicking 'View' on 'Your Audio' screen
  audioRequestView!: UserAudioRequestRow;

  audioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(
    switchMap(() => this.getAudioRequests(false)),
    tap((requests) => this.updateCount(requests.transformed_media_details))
  );

  expiredAudioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(switchMap(() => this.getAudioRequests(true)));

  getAudioRequests(expired: boolean): Observable<MediaRequests> {
    return this.http
      .get<MediaRequests>(`api/audio-requests`, {
        params: { expired },
        headers: { api_version: '2.0' },
      })
      .pipe(
        map((requests) => {
          return {
            media_request_details: requests.media_request_details.map((r) => ({
              ...r,
              hearing_date: r.hearing_date + 'T00:00:00Z',
            })),
            transformed_media_details: requests.transformed_media_details.map((r) => ({
              ...r,
              hearing_date: r.hearing_date + 'T00:00:00Z',
            })),
          };
        })
      );
  }

  deleteAudioRequests(mediaRequestId: number): Observable<HttpResponse<Response>> {
    return this.http.delete<Response>(`api/audio-requests/${mediaRequestId}`, { observe: 'response' });
  }

  //Sends request to update last accessed timestamp
  patchAudioRequestLastAccess(requestId: number, isUnread = false): Observable<HttpResponse<Response>> {
    return this.http.patch<Response>(`api/audio-requests/${requestId}`, {}, { observe: 'response' }).pipe(
      tap(() => {
        if (isUnread) {
          // Optimistically update the unread count before next polling interval
          this.countService.decrementUnreadAudioCount();
        }
      })
    );
  }

  downloadAudio(requestId: number, requestType: AudioRequestType): Observable<Blob> {
    // api/audio-requests/{playback | download}?media_request_id={requestId}
    return this.http.get(`api/audio-requests/${requestType.toLowerCase()}`, {
      params: { media_request_id: requestId },
      responseType: 'blob',
    });
  }

  setAudioRequest(audioRequestRow: UserAudioRequestRow) {
    this.audioRequestView = audioRequestRow;
  }

  filterCompletedRequests(audioRequests: MediaRequest[]): MediaRequest[] {
    return audioRequests.filter((ar) => ar.media_request_status === 'COMPLETED');
  }

  private updateCount(audioRequests: MediaRequest[]) {
    const completedRequests = this.filterCompletedRequests(audioRequests);
    this.countService.setUnreadAudioCount(this.countUnreadAudioRequests(completedRequests));
  }

  private countUnreadAudioRequests(audioRequests: MediaRequest[]): number {
    //Return count of completed rows which contain last_accessed_ts property
    return audioRequests.filter((ar) => Boolean(!ar.last_accessed_ts)).length;
  }
}
