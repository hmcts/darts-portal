import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HearingEvent, HearingAudio, requestPlaybackAudioDTO } from '@darts-types/index';
import { responsePlaybackAudioDTO } from '@darts-types/responsePlaybackAudioDTO';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HearingService {
  constructor(private readonly http: HttpClient) {}

  getEvents(hearingId: string | number): Observable<HearingEvent[]> {
    return this.http.get<HearingEvent[]>(`api/hearings/${hearingId}/events`).pipe(
      catchError((error) => {
        if (error.status === 404) return of([]);
        return throwError(() => error);
      })
    );
  }

  getAudio(hearingId: string | number): Observable<HearingAudio[]> {
    return this.http.get<HearingAudio[]>(`api/audio/hearings/${hearingId}/audios`).pipe(
      catchError((error) => {
        if (error.status === 404) return of([]);
        return throwError(() => error);
      })
    );
  }

  requestAudio(audioRequest: requestPlaybackAudioDTO): Observable<responsePlaybackAudioDTO> {
    return this.http.post<responsePlaybackAudioDTO>('api/audio-requests', audioRequest);
  }
}
