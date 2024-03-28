import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AnnotationsData } from '@portal-types/annotations/annotations-data.interface';
import { Annotations } from '@portal-types/annotations/annotations.type';
import { HearingAudio } from '@portal-types/hearing/hearing-audio.interface';
import { HearingEvent } from '@portal-types/hearing/hearing-event.interface';

import { GET_HEARINGS_PATH } from '@services/case/case.service';
import { MappingService } from '@services/mapping/mapping.service';
import { Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HearingService {
  constructor(private readonly http: HttpClient) {}

  getEvents(hearingId: string | number): Observable<HearingEvent[]> {
    return this.http.get<HearingEvent[]>(`${GET_HEARINGS_PATH}/${hearingId}/events`).pipe(
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

  getAnnotations(hearingId: string | number): Observable<Annotations[]> {
    const mappingService = new MappingService();
    return this.http
      .get<AnnotationsData[]>(`${GET_HEARINGS_PATH}/${hearingId}/annotations`)
      .pipe(map(mappingService.mapAnnotationsDataToAnnotations));
  }
}
