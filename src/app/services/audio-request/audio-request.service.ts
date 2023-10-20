import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserAudioRequestRow } from '@darts-types/index';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, map, merge, Observable, shareReplay, switchMap, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioRequestService {
  http = inject(HttpClient);
  userService = inject(UserService);

  // Defined in seconds
  private readonly POLL_INTERVAL = 60;
  private readonly UNREAD_COUNT_POLL_INTERVAL = 30;

  // Save unread count in memory
  private unreadCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly unreadCount$: Observable<number> = this.unreadCount.asObservable();

  // Store audio request when clicking 'View' on 'Your Audio' screen
  audioRequestView!: UserAudioRequestRow;

  audioRequests$ = timer(0, this.POLL_INTERVAL * 1000)
    .pipe(
      switchMap(() =>
        this.userService.userProfile$.pipe(
          switchMap((userState) => this.getAudioRequests(userState.userId, false)),
          // Refresh unread count
          tap((audioRequests) => this.updateUnread(audioRequests))
        )
      )
    )
    .pipe(shareReplay(undefined, 1000));

  expiredAudioRequests$ = timer(0, this.POLL_INTERVAL * 1000).pipe(
    switchMap(() => this.userService.userProfile$.pipe(switchMap((d) => this.getAudioRequests(d.userId, true))))
  );

  pollUnreadCount$ = timer(0, this.UNREAD_COUNT_POLL_INTERVAL * 1000).pipe(
    switchMap(() => this.userService.userProfile$.pipe(switchMap((d) => this.getUnreadCount(d.userId))))
  );

  // Merge both unread count observables into one
  unreadAudioCount$ = merge(
    this.pollUnreadCount$, // Fetches count from server
    this.unreadCount$ // In memory count / manual update
  );

  getAudioRequests(userId: number, expired: boolean): Observable<UserAudioRequest[]> {
    return this.http
      .get<UserAudioRequest[]>(`api/audio-requests`, {
        headers: { user_id: userId.toString() },
        params: { expired },
      })
      .pipe(map((requests) => requests.map((r) => ({ ...r, hearing_date: r.hearing_date + 'Z' }))));
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
          this.decrementUnreadAudioCount();
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

  getUnreadCount(userId: number): Observable<number> {
    return this.http
      .get<{ count: number }>('api/audio-requests/not-accessed-count', { headers: { user_id: userId.toString() } })
      .pipe(map((res) => res.count));
  }

  private updateUnread(audioRequests: UserAudioRequest[]) {
    const completedRequests = this.filterCompletedRequests(audioRequests);
    this.unreadCount.next(this.getUnreadCountFromAudioRequests(completedRequests));
  }

  private getUnreadCountFromAudioRequests(audioRequests: UserAudioRequest[]): number {
    //Return count of completed rows which contain last_accessed_ts property
    return audioRequests.filter((ar) => Boolean(!ar.last_accessed_ts)).length;
  }

  private decrementUnreadAudioCount() {
    this.unreadCount.next(this.unreadCount.getValue() - 1);
  }
}
