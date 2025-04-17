import { Event, EventData } from '@admin-types/events';
import { EventVersions } from '@admin-types/events/event-versions';
import { EventVersionsData } from '@admin-types/events/event-versions.interface';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  http = inject(HttpClient);

  getEvent(id: number) {
    return this.http.get<EventData>(`/api/admin/events/${id}`).pipe(map((event) => this.mapEventDataToEvent(event)));
  }

  obfuscateEventTexts(ids: number[]) {
    return this.http.post<void>('/api/admin/events/obfuscate', { eve_ids: ids });
  }

  getEventVersions(id: number) {
    return this.http
      .get<EventVersionsData>(`/api/admin/events/${id}/versions`)
      .pipe(map((versions) => this.mapEventVersions(versions)));
  }

  mapEventVersions(event: EventVersionsData): EventVersions {
    return {
      currentVersion: this.mapEventDataToEvent(event.current_version),
      previousVersions: event.previous_versions.map((event) => this.mapEventDataToEvent(event)),
    };
  }

  mapEventDataToEvent(event: EventData): Event {
    return {
      id: event.id,
      documentumId: event.documentum_id,
      sourceId: event.source_id,
      messageId: event.message_id,
      text: event.text,
      eventMapping: {
        id: event.event_mapping.id,
        name: event.event_mapping.name,
      },
      isLogEntry: event.is_log_entry,
      courthouse: {
        id: event.courthouse.id,
        displayName: event.courthouse.display_name,
      },
      courtroom: {
        id: event.courtroom.id,
        name: event.courtroom.name,
      },
      cases:
        event.cases?.map((eventCase) => ({
          id: eventCase.id,
          courthouse: {
            id: eventCase.courthouse.id,
            displayName: eventCase.courthouse.display_name,
          },
          caseNumber: eventCase.case_number,
        })) ?? undefined,
      hearings:
        event.hearings?.map((hearing) => ({
          id: hearing.id,
          caseId: hearing.case_id,
          caseNumber: hearing.case_number,
          hearingDate: DateTime.fromISO(hearing.hearing_date),
          courthouse: {
            id: hearing.courthouse.id,
            displayName: hearing.courthouse.display_name,
          },
          courtroom: {
            id: hearing.courtroom.id,
            name: hearing.courtroom.name,
          },
        })) ?? undefined,
      version: event.version,
      chronicleId: event.chronicle_id,
      antecedentId: event.antecedent_id,
      isDataAnonymised: event.is_data_anonymised,
      eventStatus: event.event_status,
      eventTs: DateTime.fromISO(event.event_ts),
      createdAt: DateTime.fromISO(event.created_at),
      createdById: event.created_by,
      lastModifiedAt: DateTime.fromISO(event.last_modified_at),
      lastModifiedById: event.last_modified_by,
      isCurrentVersion: event.is_current,
    };
  }
}
