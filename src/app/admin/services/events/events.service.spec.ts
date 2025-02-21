import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { EventVersionsData } from '@admin-types/events/event-versions.interface';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DateTime } from 'luxon';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [], providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getEvent', () => {
    it('should retrieve event data and transform it', () => {
      const mockResponse = {
        id: 1,
        documentum_id: 1,
        source_id: 1,
        message_id: 1,
        text: 'text',
        event_mapping: {
          id: 1,
        },
        is_log_entry: true,
        courthouse: {
          id: 1,
          display_name: 'display_name',
        },
        courtroom: {
          id: 1,
          name: 'name',
        },
        version: 1,
        chronicle_id: 1,
        antecedent_id: 1,
        is_data_anonymised: true,
        event_ts: '2024-05-05T11:00:00Z',
        created_at: '2024-05-05T11:00:00Z',
        created_by: 1,
        last_modified_at: '2024-05-05T11:00:00Z',
        last_modified_by: 1,
      };

      let event;
      service.getEvent(1).subscribe((e) => {
        event = e;
      });

      const expectedEvent = {
        id: 1,
        documentumId: 1,
        sourceId: 1,
        messageId: 1,
        text: 'text',
        eventMapping: {
          id: 1,
        },
        isLogEntry: true,
        courthouse: {
          id: 1,
          displayName: 'display_name',
        },
        courtroom: {
          id: 1,
          name: 'name',
        },
        version: 1,
        chronicleId: 1,
        antecedentId: 1,
        isDataAnonymised: true,
        eventTs: DateTime.fromISO('2024-05-05T11:00:00Z'),
        createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
        createdById: 1,
        lastModifiedAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
        lastModifiedById: 1,
      };

      const req = httpMock.expectOne('/api/admin/events/1');
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);

      expect(event).toEqual(expectedEvent);
    });
  });

  describe('#obfuscateEventTexts', () => {
    it('should send a POST request to obfuscate event texts', fakeAsync(() => {
      const eventIds = [1, 2, 3];

      service.obfuscateEventTexts(eventIds).subscribe();
      tick();

      const req = httpMock.expectOne('/api/admin/events/obfuscate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ eve_ids: eventIds });

      req.flush(null);
    }));
  });

  describe('#getEventVersions', () => {
    it('should retrieve event versions and map them correctly', fakeAsync(() => {
      const mockResponse = {
        current_version: {
          id: 1,
          documentum_id: 1,
          source_id: 1,
          message_id: 1,
          text: 'Current Event Text',
          event_mapping: { id: 1, name: 'Current Event' },
          is_log_entry: true,
          courthouse: { id: 1, display_name: 'Current Courthouse' },
          courtroom: { id: 1, name: 'Current Courtroom' },
          version: 'v2',
          chronicle_id: 'chronicle_2',
          antecedent_id: 'antecedent_2',
          is_data_anonymised: false,
          event_ts: '2024-05-10T12:00:00Z',
          created_at: '2024-05-10T12:00:00Z',
          created_by: 2,
          last_modified_at: '2024-05-10T12:00:00Z',
          last_modified_by: 2,
          is_current: true,
        },
        previous_versions: [
          {
            id: 2,
            documentum_id: 2,
            source_id: 2,
            message_id: 2,
            text: 'Previous Event Text',
            event_mapping: { id: 2, name: 'Previous Event' },
            is_log_entry: false,
            courthouse: { id: 2, display_name: 'Previous Courthouse' },
            courtroom: { id: 2, name: 'Previous Courtroom' },
            version: 'v1',
            chronicle_id: 'chronicle_1',
            antecedent_id: 'antecedent_1',
            is_data_anonymised: true,
            event_ts: '2024-04-10T10:00:00Z',
            created_at: '2024-04-10T10:00:00Z',
            created_by: 3,
            last_modified_at: '2024-04-10T10:00:00Z',
            last_modified_by: 3,
            is_current: false,
          },
        ],
      };

      let eventVersions;
      service.getEventVersions(1).subscribe((versions) => {
        eventVersions = versions;
      });

      const req = httpMock.expectOne('/api/admin/events/1/versions');
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);

      const expectedEventVersions = {
        currentVersion: {
          id: 1,
          documentumId: 1,
          sourceId: 1,
          messageId: 1,
          text: 'Current Event Text',
          eventMapping: { id: 1, name: 'Current Event' },
          isLogEntry: true,
          courthouse: { id: 1, displayName: 'Current Courthouse' },
          courtroom: { id: 1, name: 'Current Courtroom' },
          version: 'v2',
          chronicleId: 'chronicle_2',
          antecedentId: 'antecedent_2',
          isDataAnonymised: false,
          eventTs: DateTime.fromISO('2024-05-10T12:00:00Z'),
          createdAt: DateTime.fromISO('2024-05-10T12:00:00Z'),
          createdById: 2,
          lastModifiedAt: DateTime.fromISO('2024-05-10T12:00:00Z'),
          lastModifiedById: 2,
          isCurrentVersion: true,
        },
        previousVersions: [
          {
            id: 2,
            documentumId: 2,
            sourceId: 2,
            messageId: 2,
            text: 'Previous Event Text',
            eventMapping: { id: 2, name: 'Previous Event' },
            isLogEntry: false,
            courthouse: { id: 2, displayName: 'Previous Courthouse' },
            courtroom: { id: 2, name: 'Previous Courtroom' },
            version: 'v1',
            chronicleId: 'chronicle_1',
            antecedentId: 'antecedent_1',
            isDataAnonymised: true,
            eventTs: DateTime.fromISO('2024-04-10T10:00:00Z'),
            createdAt: DateTime.fromISO('2024-04-10T10:00:00Z'),
            createdById: 3,
            lastModifiedAt: DateTime.fromISO('2024-04-10T10:00:00Z'),
            lastModifiedById: 3,
            isCurrentVersion: false,
          },
        ],
      };

      expect(eventVersions).toEqual(expectedEventVersions);
    }));
  });

  describe('#mapEventVersions', () => {
    it('should correctly map event versions data', () => {
      const mockEventVersions = {
        current_version: {
          id: 1,
          event_mapping: { id: 1, name: 'Event Name' },
          courthouse: { id: 1, display_name: 'Courthouse' },
          courtroom: { id: 1, name: 'Courtroom' },
          text: 'Current Event',
          event_ts: '2024-05-10T12:00:00Z',
        },
        previous_versions: [],
      } as unknown as EventVersionsData;

      const result = service.mapEventVersions(mockEventVersions);
      expect(result.currentVersion.text).toBe('Current Event');
      expect(result.previousVersions.length).toBe(0);
    });
  });
});
