import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HearingAudio, HearingEvent } from 'src/app/types/hearing-audio-event';

@Injectable({
  providedIn: 'root',
})
export class HearingService {
  http = inject(HttpClient);

  getEvents(hearingId: string | number): Observable<HearingEvent[]> {
    return this.http.get<HearingEvent[]>(`api/cases/hearings/${hearingId}/events`);
  }

  getAudio(hearingId: string | number): Observable<HearingAudio[]> {
    return this.http.get<HearingAudio[]>(`api/cases/hearings/${hearingId}/audios`);
  }
}
