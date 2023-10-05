import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { HeaderService } from '@services/header/header.service';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  headerService = inject(HeaderService);
  datePipe = inject(DatePipe);
  userService = inject(UserService);

  audioRequests$: Observable<UserAudioRequest[]>;
  expiredAudioRequests$: Observable<UserAudioRequest[]>;

  private unreadCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly unreadCount$: Observable<number> = this.unreadCount.asObservable();

  constructor(private http: HttpClient) {
    this.audioRequests$ = this.userService.req$.pipe(
      switchMap((d) => this.getAudioRequestsForUser(d.userId, false)),
      tap((d) => this.updateUnread(d))
    );
    this.expiredAudioRequests$ = this.userService.req$.pipe(
      switchMap((d) => this.getAudioRequestsForUser(d.userId, true))
    );
  }

  getAudioRequestsForUser(userId: number, expired: boolean): Observable<UserAudioRequest[]> {
    return this.http.get<UserAudioRequest[]>(`api/audio-requests`, {
      headers: { user_id: userId.toString() },
      params: { expired },
    });
  }

  updateUnread(audioRequests: UserAudioRequest[]) {
    const completed = this.filterCompletedRequests(audioRequests);
    this.unreadCount.next(this.getUnreadCount(completed));
  }

  //Sends request to update last accessed timestamp
  patchAudioRequest(requestId: number): Observable<HttpResponse<Response>> {
    return this.http.patch<Response>(`api/audio-requests/${requestId}`, {}, { observe: 'response' });
  }

  filterCompletedRequests(audioRequests: UserAudioRequest[]): UserAudioRequest[] {
    return audioRequests.filter((ar) => ar.media_request_status === 'COMPLETED');
  }

  getUnreadCount(audioRequests: UserAudioRequest[]): number {
    //Return count of completed rows which contain last_accessed_ts property
    return audioRequests.filter((ar) => Boolean(!ar.last_accessed_ts)).length;
  }
}
