import { Event, EventData } from '@admin-types/events';

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

  mapEventDataToEvent(event: EventData): Event {
    return {
      id: event.id,
      documentumId: event.documentum_id,
      sourceId: event.source_id,
      messageId: event.message_id,
      text: event.text,
      eventMapping: {
        id: event.event_mapping.id,
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
      version: event.version,
      chronicleId: event.chronicle_id,
      antecedentId: event.antecedent_id,
      isDataAnonymised: event.is_data_anonymised,
      eventTs: DateTime.fromISO(event.event_ts),
      createdAt: DateTime.fromISO(event.created_at),
      createdById: event.created_by,
      lastModifiedAt: DateTime.fromISO(event.last_modified_at),
      lastModifiedById: event.last_modified_by,
      caseExpiredAt: DateTime.fromISO(event.case_expired_at),
      isCurrentVersion: event.is_current,
    };
  }
}
