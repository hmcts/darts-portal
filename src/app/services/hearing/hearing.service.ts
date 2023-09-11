import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { HearingAudio, HearingEvent } from 'src/app/types/hearing-audio-event';

@Injectable({
  providedIn: 'root',
})
export class HearingService {
  http = inject(HttpClient);

  getEvents(hearingId: string | number): Observable<HearingEvent[]> {
    return this.http.get<HearingEvent[]>(`api/cases/hearings/${hearingId}/events`).pipe(
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
}
