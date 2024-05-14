import { EventMappingData } from '@admin-types/event-mappings/event-mapping.interface';
import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventMappingsService {
  http = inject(HttpClient);

  getEventMappings(): Observable<EventMapping[]> {
    return this.http
      .get<EventMappingData[]>(`api/admin/event-mappings`)
      .pipe(map((eventMappings) => eventMappings.map(this.mapEventMappings)));
  }

  getEventHandlers(): Observable<string[]> {
    return this.http.get<string[]>(`api/admin/event-handlers`);
  }

  mapEventMappings(e: EventMappingData): EventMapping {
    return {
      id: e.id,
      type: e.type,
      subType: e.sub_type,
      name: e.name,
      handler: e.handler,
      isActive: e.is_active,
      hasRestrictions: e.has_restrictions,
      createdAt: DateTime.fromISO(e.created_at),
    };
  }
}
