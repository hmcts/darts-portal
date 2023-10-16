import { UserAudioRequestRow } from '@darts-types/index';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, Observable, combineLatest, switchMap, tap, timer, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioRequestService {
  audioRequests$: Observable<UserAudioRequest[]>;
  expiredAudioRequests$: Observable<UserAudioRequest[]>;
  audioRequestView!: UserAudioRequestRow;

  //Defined in seconds
  private POLL_INTERVAL = 60;

  private unreadCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly unreadCount$: Observable<number> = this.unreadCount.asObservable();

  headerData$: Observable<{
    audioRequest: UserAudioRequest[];
    unreadCount: number;
  }>;

  constructor(
    private http: HttpClient,
    userService: UserService
  ) {
    this.audioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(
      switchMap(() =>
        userService.getUserProfile().pipe(
          switchMap((d) => this.getAudioRequestsForUser(d.userId, false)),
          tap((d) => this.updateUnread(d))
        )
      )
    );

    this.expiredAudioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(
      switchMap(() => userService.getUserProfile().pipe(switchMap((d) => this.getAudioRequestsForUser(d.userId, true))))
    );

    this.headerData$ = combineLatest({
      audioRequest: this.audioRequests$,
      unreadCount: this.unreadCount$,
    });
  }

  getAudioRequestsForUser(userId: number, expired: boolean): Observable<UserAudioRequest[]> {
    return this.http
      .get<UserAudioRequest[]>(`api/audio-requests`, {
        headers: { user_id: userId.toString() },
        params: { expired },
      })
      .pipe(map((requests) => requests.map((r) => ({ ...r, hearing_date: r.hearing_date + 'Z' }))));
  }

  deleteAudioRequests(mediaRequestId: number): Observable<HttpResponse<object>> {
    return this.http.delete(`api/audio-requests/${mediaRequestId}`, { observe: 'response' });
  }

  updateUnread(audioRequests: UserAudioRequest[]) {
    const completed = this.filterCompletedRequests(audioRequests);
    this.unreadCount.next(this.getUnreadCount(completed));
  }

  //Sends request to update last accessed timestamp
  patchAudioRequest(requestId: number): Observable<HttpResponse<Response>> {
    return this.http.patch<Response>(`api/audio-requests/${requestId}`, {}, { observe: 'response' });
  }

  downloadAudio(requestId: number): Observable<Blob> {
    return this.http.get(`api/audio-requests/download`, {
      params: { media_request_id: requestId },
      responseType: 'blob',
    });
  }

  setAudioRequest(audioRequestRow: UserAudioRequestRow) {
    this.audioRequestView = audioRequestRow;
  }

  filterCompletedRequests(audioRequests: UserAudioRequest[]): UserAudioRequest[] {
    return audioRequests.filter((ar) => ar.media_request_status === 'COMPLETED');
  }

  getUnreadCount(audioRequests: UserAudioRequest[]): number {
    //Return count of completed rows which contain last_accessed_ts property
    return audioRequests.filter((ar) => Boolean(!ar.last_accessed_ts)).length;
  }
}
