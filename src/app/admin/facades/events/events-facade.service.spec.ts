import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { Event } from '@admin-types/events';
import { EventVersions } from '@admin-types/events/event-versions';
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
      getEventVersions: jest.fn(),
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
        isCurrentVersion: false,
        cases: [
          {
            id: 0,
            courthouse: {
              id: 0,
              displayName: '',
            },
            caseNumber: '',
          },
        ],
        hearings: [
          {
            id: 0,
            caseId: 0,
            caseNumber: '',
            hearingDate: DateTime.fromISO('2024-05-05T11:00:00Z'),
            courthouse: {
              id: 0,
              displayName: '',
            },
            courtroom: {
              id: 0,
              name: '',
            },
          },
        ],
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

  describe('obfuscateEventText', () => {
    it('calls events service to obfuscate event text', () => {
      eventsService.obfuscateEventTexts = jest.fn();

      service.obfuscateEventText(1);

      expect(eventsService.obfuscateEventTexts).toHaveBeenCalledWith([1]);
    });
  });

  describe('#getEventVersions', () => {
    it('should retrieve event versions and map them correctly', fakeAsync(() => {
      const mockResponse: EventVersions = {
        currentVersion: {
          id: 1,
          sourceId: 123,
          eventTs: DateTime.fromISO('2024-05-10T12:00:00Z'),
          eventMapping: { id: 1, name: 'Current Event' },
          courthouse: { id: 1, displayName: 'Current Courthouse' },
          courtroom: { id: 1, name: 'Current Courtroom' },
          text: 'Current Event Text',
        } as Event,
        previousVersions: [
          {
            id: 2,
            sourceId: 0,
            eventTs: DateTime.fromISO('2024-04-10T10:00:00Z'),
            eventMapping: { id: 2, name: 'Previous Event' },
            courthouse: { id: 2, displayName: 'Previous Courthouse' },
            courtroom: { id: 2, name: 'Previous Courtroom' },
            text: 'Previous Event Text',
          } as Event,
        ],
      };

      eventsService.getEventVersions.mockReturnValue(of(mockResponse));

      let eventVersions;
      service.getEventVersions(1).subscribe((versions) => {
        eventVersions = versions;
      });

      tick();

      expect(eventsService.getEventVersions).toHaveBeenCalledWith(1);

      const expectedEventVersions = {
        currentVersion: {
          id: 1,
          event_id: 123,
          timestamp: DateTime.fromISO('2024-05-10T12:00:00Z'),
          name: 'Current Event',
          courthouse: 'Current Courthouse',
          courtroom: 'Current Courtroom',
          text: 'Current Event Text',
        },
        previousVersions: [
          {
            id: 2,
            event_id: 0,
            timestamp: DateTime.fromISO('2024-04-10T10:00:00Z'),
            name: 'Previous Event',
            courthouse: 'Previous Courthouse',
            courtroom: 'Previous Courtroom',
            text: 'Previous Event Text',
          },
        ],
      };

      expect(eventVersions).toEqual(expectedEventVersions);
    }));
  });

  describe('#mapEventVersions', () => {
    it('should correctly map event versions data', () => {
      const mockEventVersions: EventVersions = {
        currentVersion: {
          id: 1,
          sourceId: 456,
          eventTs: DateTime.fromISO('2024-05-10T12:00:00Z'),
          eventMapping: { id: 1, name: 'Event Name' },
          courthouse: { id: 1, displayName: 'Courthouse' },
          courtroom: { id: 1, name: 'Courtroom' },
          text: 'Current Event',
        } as Event,
        previousVersions: [],
      };

      const result = service['mapEventVersions'](mockEventVersions);
      expect(result.currentVersion.text).toBe('Current Event');
      expect(result.previousVersions.length).toBe(0);
    });
  });
});
