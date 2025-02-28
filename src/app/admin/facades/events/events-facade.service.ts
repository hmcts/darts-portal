import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { Event, EventVersionData } from '@admin-types/events';
import { EventVersions } from '@admin-types/events/event-versions';
import { User } from '@admin-types/index';
import { inject, Injectable } from '@angular/core';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { EventsService } from '@services/events/events.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { forkJoin, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsFacadeService {
  private eventsService = inject(EventsService);
  private userAdminService = inject(UserAdminService);
  private eventMappingsService = inject(EventMappingsService);

  getEvent(id: number) {
    return this.eventsService.getEvent(id).pipe(switchMap((event) => this.getAssociatedData(event)));
  }

  obfuscateEventText(id: number) {
    return this.eventsService.obfuscateEventTexts([id]);
  }

  getEventVersions(id: number) {
    return this.eventsService.getEventVersions(id).pipe(switchMap((event) => of(this.mapEventVersions(event))));
  }

  private mapEventVersions(eventVersions: EventVersions) {
    return {
      currentVersion: this.mapEventTableData(eventVersions.currentVersion),
      previousVersions: eventVersions.previousVersions.map((event) => this.mapEventTableData(event)),
    };
  }

  private mapEventTableData(event: Event): EventVersionData {
    return {
      id: event.id,
      event_id: event.sourceId,
      timestamp: event.eventTs,
      name: event.eventMapping.name,
      courthouse: event.courthouse.displayName,
      courtroom: event.courtroom.name,
      text: event.text,
    };
  }

  private getAssociatedData(event: Event) {
    const userIds = [event.createdById, event.lastModifiedById];

    return forkJoin({
      users: this.userAdminService.getUsersById(userIds),
      eventMapping: this.eventMappingsService.getEventMapping(event.eventMapping.id),
    }).pipe(map(({ users, eventMapping }) => this.mapUsersAndEventMappingToEvent(event, users, eventMapping)));
  }

  private mapUsersAndEventMappingToEvent(event: Event, users: User[], eventMapping: EventMapping): Event {
    return {
      ...event,
      createdBy: users.find((user) => user.id === event.createdById),
      lastModifiedBy: users.find((user) => user.id === event.lastModifiedById),
      eventMapping,
    };
  }
}
