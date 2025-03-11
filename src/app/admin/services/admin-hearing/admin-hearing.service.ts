import { HearingAudioData } from '@admin-types/hearing/hearing-audio.interface';
import { HearingAudio } from '@admin-types/hearing/hearing-audio.type';
import { AdminHearingEventData } from '@admin-types/hearing/hearing-events-data.type';
import { AdminHearingEvent } from '@admin-types/hearing/hearing-events.type';
import { AdminHearingData } from '@admin-types/hearing/hearing.interface';
import { AdminHearing } from '@admin-types/hearing/hearing.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminHearingService {
  http = inject(HttpClient);

  getHearing(id: number): Observable<AdminHearing> {
    return this.http.get<AdminHearingData>(`/api/admin/hearings/${id}`).pipe(map(this.mapAdminHearing));
  }

  private mapAdminHearing(data: AdminHearingData): AdminHearing {
    return {
      id: data.id,
      hearingDate: DateTime.fromISO(data.hearing_date),
      scheduledStartTime: data.scheduled_start_time,
      hearingIsActual: data.hearing_is_actual,
      case: {
        id: data.case.id,
        caseNumber: data.case.case_number,
        courthouse: {
          id: data.case.courthouse.id,
          displayName: data.case.courthouse.display_name,
        },
        defendants: data.case.defendants,
        prosecutors: data.case.prosecutors,
        defenders: data.case.defenders,
        judges: data.case.judges,
      },
      courtroom: {
        id: data.courtroom.id,
        name: data.courtroom.name,
      },
      judges: data.judges,
      createdAt: DateTime.fromISO(data.created_at),
      createdById: data.created_by,
      lastModifiedAt: DateTime.fromISO(data.last_modified_at),
      lastModifiedById: data.last_modified_by,
    };
  }

  getHearingAudios(id: number): Observable<HearingAudio[]> {
    return this.http.get<HearingAudioData[]>(`/api/admin/hearings/${id}/audios`).pipe(map(this.mapHearingAudios));
  }

  private mapHearingAudios(data: HearingAudioData[]): HearingAudio[] {
    return data.map((audio) => ({
      id: audio.id,
      startAt: DateTime.fromISO(audio.start_at),
      endAt: DateTime.fromISO(audio.end_at),
      filename: audio.filename,
      channel: audio.channel,
      totalChannels: audio.total_channels,
    }));
  }

  getEvents(hearingId: string | number): Observable<AdminHearingEvent[]> {
    return this.http.get<AdminHearingEventData[]>(`api/hearings/${hearingId}/events`).pipe(
      map((events) => this.mapHearingEvents(events).sort((a, b) => a.timestamp.diff(b.timestamp).milliseconds)),
      catchError((error) => {
        if (error.status === 404) return of([]);
        return throwError(() => error);
      })
    );
  }

  private mapHearingEvents(data: AdminHearingEventData[]): AdminHearingEvent[] {
    return data.map((event) => ({
      id: event.id,
      timestamp: DateTime.fromISO(event.timestamp),
      name: event.name,
    }));
  }
}
