import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor(private http: HttpClient) {}

  getAudioRequestsForUser(userId: number, expired: boolean): Observable<UserAudioRequest[]> {
    return this.http
      .get<UserAudioRequest[]>(`api/audio-requests`, {
        headers: { user_id: userId.toString() },
        params: { expired },
      })
      .pipe(shareReplay(1));
  }

  //Sends request to update last accessed timestamp
  patchAudioRequest(requestId: number): Observable<HttpResponse<Response>> {
    return this.http.patch<Response>(`api/audio-requests/${requestId}`, {}, { observe: 'response' });
  }
}
