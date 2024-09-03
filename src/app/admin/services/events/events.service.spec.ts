import { TestBed } from '@angular/core/testing';

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
});
