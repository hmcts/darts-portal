import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { Event } from '@admin-types/events';
import { User } from '@admin-types/index';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { EventsService } from '@services/events/events.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { EventsFacadeService } from './events-facade.service';

describe('EventsFacadeService', () => {
  let service: EventsFacadeService;
  let eventsService: jest.Mocked<EventsService>;
  let userAdminService: jest.Mocked<UserAdminService>;
  let eventMappingsService: jest.Mocked<EventMappingsService>;

  beforeEach(() => {
    const eventsServiceMock = {
      getEvent: jest.fn(),
    };

    const userAdminServiceMock = {
      getUsersById: jest.fn(),
    };

    const eventMappingsServiceMock = {
      getEventMapping: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        EventsFacadeService,
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: UserAdminService, useValue: userAdminServiceMock },
        { provide: EventMappingsService, useValue: eventMappingsServiceMock },
      ],
    });

    service = TestBed.inject(EventsFacadeService);
    eventsService = TestBed.inject(EventsService) as jest.Mocked<EventsService>;
    userAdminService = TestBed.inject(UserAdminService) as jest.Mocked<UserAdminService>;
    eventMappingsService = TestBed.inject(EventMappingsService) as jest.Mocked<EventMappingsService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvent', () => {
    it('calls data services and maps associated data', fakeAsync(() => {
      const mockEvent: Event = {
        id: 1,
        createdById: 1,
        lastModifiedById: 2,
        eventMapping: { id: 1 } as EventMapping,
        documentumId: '',
        sourceId: 0,
        messageId: '',
        text: '',
        isLogEntry: false,
        courthouse: {
          id: 0,
          displayName: '',
        },
        courtroom: {
          id: 0,
          name: '',
        },
        version: '',
        chronicleId: '',
        antecedentId: '',
        isDataAnonymised: false,
        eventTs: DateTime.fromISO('2024-05-05T11:00:00Z'),
        createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
        lastModifiedAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
        caseExpiredAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
      };

      const mockUsers: User[] = [
        { id: 1, name: 'User 1' } as unknown as User,
        { id: 2, name: 'User 2' } as unknown as User,
      ];

      const mockEventMapping: EventMapping = { id: 1, mappingName: 'Test Mapping' } as unknown as EventMapping;

      eventsService.getEvent.mockReturnValue(of(mockEvent));
      userAdminService.getUsersById.mockReturnValue(of(mockUsers));
      eventMappingsService.getEventMapping.mockReturnValue(of(mockEventMapping));

      service.getEvent(1).subscribe((result) => {
        expect(eventsService.getEvent).toHaveBeenCalledWith(1);
        expect(userAdminService.getUsersById).toHaveBeenCalledWith([1, 2]);
        expect(eventMappingsService.getEventMapping).toHaveBeenCalledWith(1);

        expect(result).toEqual({
          ...mockEvent,
          createdBy: mockUsers[0],
          lastModifiedBy: mockUsers[1],
          eventMapping: mockEventMapping,
        });
      });
      tick();
    }));
  });
});
