import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { EventData } from '@admin-types/events';
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

  describe('#mapEventDataToEvent', () => {
    it('should correctly map cases and hearings from event data', () => {
      const mockEventData = {
        id: 1,
        documentum_id: 1,
        source_id: 1,
        message_id: 'msg-001',
        text: 'Sample event text',
        event_mapping: { id: 101, name: 'Event Mapping Name' },
        is_log_entry: true,
        courthouse: { id: 5, display_name: 'Main Courthouse' },
        courtroom: { id: 10, name: 'Courtroom A' },
        cases: [
          {
            id: 201,
            case_number: 'CASE001',
            courthouse: { id: 5, display_name: 'Main Courthouse' },
          },
          {
            id: 202,
            case_number: 'CASE002',
            courthouse: { id: 6, display_name: 'Secondary Courthouse' },
          },
        ],
        hearings: [
          {
            id: 301,
            case_id: 201,
            case_number: 'CASE001',
            hearing_date: '2024-06-10T10:00:00Z',
            courthouse: { id: 5, display_name: 'Main Courthouse' },
            courtroom: { id: 10, name: 'Courtroom A' },
          },
        ],
        version: 'v1',
        chronicle_id: 'chron-101',
        antecedent_id: 'ant-101',
        is_data_anonymised: false,
        event_ts: '2024-06-01T12:30:00Z',
        event_status: 4,
        created_at: '2024-06-01T12:30:00Z',
        created_by: 1,
        last_modified_at: '2024-06-02T14:00:00Z',
        last_modified_by: 2,
        is_current: true,
      } as unknown as EventData;

      const expectedMappedEvent = {
        id: 1,
        documentumId: 1,
        sourceId: 1,
        messageId: 'msg-001',
        text: 'Sample event text',
        eventMapping: { id: 101, name: 'Event Mapping Name' },
        isLogEntry: true,
        courthouse: { id: 5, displayName: 'Main Courthouse' },
        courtroom: { id: 10, name: 'Courtroom A' },
        cases: [
          {
            id: 201,
            caseNumber: 'CASE001',
            courthouse: { id: 5, displayName: 'Main Courthouse' },
          },
          {
            id: 202,
            caseNumber: 'CASE002',
            courthouse: { id: 6, displayName: 'Secondary Courthouse' },
          },
        ],
        hearings: [
          {
            id: 301,
            caseId: 201,
            caseNumber: 'CASE001',
            hearingDate: DateTime.fromISO('2024-06-10T10:00:00Z'),
            courthouse: { id: 5, displayName: 'Main Courthouse' },
            courtroom: { id: 10, name: 'Courtroom A' },
          },
        ],
        version: 'v1',
        chronicleId: 'chron-101',
        antecedentId: 'ant-101',
        isDataAnonymised: false,
        eventStatus: 4,
        eventTs: DateTime.fromISO('2024-06-01T12:30:00Z'),
        createdAt: DateTime.fromISO('2024-06-01T12:30:00Z'),
        createdById: 1,
        lastModifiedAt: DateTime.fromISO('2024-06-02T14:00:00Z'),
        lastModifiedById: 2,
        isCurrentVersion: true,
      };

      const mappedEvent = service.mapEventDataToEvent(mockEventData);

      expect(mappedEvent).toEqual(expectedMappedEvent);
    });

    it('should handle missing cases and hearings gracefully', () => {
      const mockEventData = {
        id: 2,
        documentum_id: 2,
        source_id: 2,
        message_id: 'msg-002',
        text: 'Sample event text with no cases or hearings',
        event_mapping: { id: 102, name: 'Event Mapping 2' },
        is_log_entry: false,
        courthouse: { id: 6, display_name: 'Secondary Courthouse' },
        courtroom: { id: 12, name: 'Courtroom B' },
        cases: undefined, // No cases
        hearings: undefined, // No hearings
        version: 'v2',
        chronicle_id: 'chron-102',
        antecedent_id: 'ant-102',
        is_data_anonymised: true,
        event_ts: '2024-06-05T10:30:00Z',
        created_at: '2024-06-05T10:30:00Z',
        created_by: 3,
        last_modified_at: '2024-06-06T12:00:00Z',
        last_modified_by: 4,
        is_current: false,
      } as unknown as EventData;

      const expectedMappedEvent = {
        id: 2,
        documentumId: 2,
        sourceId: 2,
        messageId: 'msg-002',
        text: 'Sample event text with no cases or hearings',
        eventMapping: { id: 102, name: 'Event Mapping 2' },
        isLogEntry: false,
        courthouse: { id: 6, displayName: 'Secondary Courthouse' },
        courtroom: { id: 12, name: 'Courtroom B' },
        cases: undefined, // No cases should be mapped
        hearings: undefined, // No hearings should be mapped
        version: 'v2',
        chronicleId: 'chron-102',
        antecedentId: 'ant-102',
        isDataAnonymised: true,
        eventTs: DateTime.fromISO('2024-06-05T10:30:00Z'),
        createdAt: DateTime.fromISO('2024-06-05T10:30:00Z'),
        createdById: 3,
        lastModifiedAt: DateTime.fromISO('2024-06-06T12:00:00Z'),
        lastModifiedById: 4,
        isCurrentVersion: false,
      };

      const mappedEvent = service.mapEventDataToEvent(mockEventData);

      expect(mappedEvent).toEqual(expectedMappedEvent);
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
      expect(result.currentVersion!.text).toBe('Current Event');
      expect(result.previousVersions.length).toBe(0);
    });
  });

  describe('#setCurrentVersion', () => {
    it('should send a PATCH request to set current event version', fakeAsync(() => {
      const eventId = 123;

      service.setCurrentVersion(eventId).subscribe();
      tick();

      const req = httpMock.expectOne(`/api/admin/events/${eventId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ is_current: true });
      expect(req.request.responseType).toBe('text');

      req.flush(null);
    }));
  });
});
