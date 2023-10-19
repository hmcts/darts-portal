import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAudioRequestRow } from '@darts-types/index';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap, timer } from 'rxjs';

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
      .pipe(map((requests) => requests.map((r) => ({ ...r, hearing_date: r.hearing_date + 'T00:00:00Z' }))));
  }

  deleteAudioRequests(mediaRequestId: number): Observable<HttpResponse<Response>> {
    return this.http.delete<Response>(`api/audio-requests/${mediaRequestId}`, { observe: 'response' });
  }

  updateUnread(audioRequests: UserAudioRequest[]) {
    const completed = this.filterCompletedRequests(audioRequests);
    this.unreadCount.next(this.getUnreadCount(completed));
  }

  //Sends request to update last accessed timestamp
  patchAudioRequestLastAccess(requestId: number, isUnread = false): Observable<HttpResponse<Response>> {
    return this.http.patch<Response>(`api/audio-requests/${requestId}`, {}, { observe: 'response' }).pipe(
      tap(() => {
        if (isUnread) {
          // Optimistically update the unread count before next polling interval
          this.unreadCount.next(this.unreadCount.getValue() - 1);
        }
      })
    );
  }

  getDownloadUrl(requestId: number): string {
    return `/api/audio-requests/download?media_request_id=${requestId}`;
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
