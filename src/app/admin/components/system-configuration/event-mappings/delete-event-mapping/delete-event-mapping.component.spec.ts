import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { DeleteEventMappingComponent } from './delete-event-mapping.component';

describe('DeleteEventMappingComponent', () => {
  let component: DeleteEventMappingComponent;
  let fixture: ComponentFixture<DeleteEventMappingComponent>;

  const mockEventMapping = {
    id: 1,
    type: 'Type1',
    subType: 'SubType1',
    name: 'Event name',
    handler: 'Event handler',
    hasRestrictions: false,
    createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
    isActive: true,
  };

  const mockActivatedRoute = {
    snapshot: {
      params: { id: '1' },
    },
  };

  const eventMappingsService = {
    getEventMapping: jest.fn(),
    deleteEventMapping: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(eventMappingsService, 'getEventMapping').mockReturnValue(of(mockEventMapping));
    jest.spyOn(eventMappingsService, 'deleteEventMapping').mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [DeleteEventMappingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: EventMappingsService, useValue: eventMappingsService },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEventMappingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the event mapping on initialization', () => {
    let result;
    component.eventMapping$.subscribe((eventMapping) => {
      result = eventMapping;
    });
    expect(result).toEqual(mockEventMapping);
    expect(eventMappingsService.getEventMapping).toHaveBeenCalledWith(1);
  });

  it('should navigate to the event mappings path with queryParams on delete confirmed', () => {
    const navigateSpy = jest.spyOn(component.router, 'navigate');

    component.onDeleteConfirmed();
    expect(eventMappingsService.deleteEventMapping).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['admin/system-configuration/event-mappings'], {
      queryParams: { deleteEventMapping: true },
    });
  });

  it('should navigate to the edit path on delete cancelled', () => {
    const navigateSpy = jest.spyOn(component.router, 'navigate');

    component.onDeleteCancelled();
    expect(navigateSpy).toHaveBeenCalledWith(['admin/system-configuration/event-mappings', 1, 'edit']);
  });
});
