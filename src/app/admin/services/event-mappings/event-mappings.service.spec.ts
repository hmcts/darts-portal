import { TestBed } from '@angular/core/testing';

import { EventMappingData } from '@admin-types/event-mappings/event-mapping.interface';
import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DateTime } from 'luxon';
import { EventMappingsService } from './event-mappings.service';

describe('EventMappingsService', () => {
  let service: EventMappingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(EventMappingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve event mappings and transform them', () => {
    const mockResponse: EventMappingData[] = [
      {
        id: 1,
        type: '1000',
        sub_type: '1001',
        name: 'Prosecution opened',
        handler: 'StandardEventHandler',
        is_active: true,
        has_restrictions: false,
        created_at: '2024-05-05T11:00:00Z',
      },
    ];

    let eventMappings: EventMapping[];
    service.getEventMappings().subscribe((mappings) => {
      eventMappings = mappings;
    });

    const expectedMapping: EventMapping = {
      id: 1,
      type: '1000',
      subType: '1001',
      name: 'Prosecution opened',
      handler: 'StandardEventHandler',
      isActive: true,
      hasRestrictions: false,
      createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
    };

    const req = httpMock.expectOne('api/admin/event-mappings');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(eventMappings!.length).toBe(1);
    expect(eventMappings![0]).toEqual(expectedMapping);
  });

  it('should retrieve event handlers', () => {
    const mockHandlers = ['StandardEventHandler', 'TranscriptionRequestHandler'];

    let eventHandlers: string[];
    service.getEventHandlers().subscribe((handlers) => {
      eventHandlers = handlers;
    });

    const req = httpMock.expectOne('api/admin/event-handlers');
    expect(req.request.method).toBe('GET');
    req.flush(mockHandlers);

    expect(eventHandlers!.length).toBe(2);
    expect(eventHandlers!).toEqual(mockHandlers);
  });
});
