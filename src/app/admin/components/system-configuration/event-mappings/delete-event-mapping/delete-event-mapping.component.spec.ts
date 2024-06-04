import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
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
    createdAt: '2024-05-05T11:00:00Z',
    isActive: true,
  };

  const mockActivatedRoute = {
    snapshot: {
      params: { id: '1' },
    },
  };

  let router = {
    navigate: jest.fn(),
  } as unknown as Router;

  const eventMappingsService = {
    getEventMapping: jest.fn(),
    deleteEventMapping: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(eventMappingsService, 'getEventMapping').mockReturnValue(of(mockEventMapping));
    jest.spyOn(eventMappingsService, 'deleteEventMapping').mockReturnValue(of({}));
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [DeleteEventMappingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: EventMappingsService, useValue: eventMappingsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEventMappingComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the event mapping on initialization', () => {
    component.eventMapping$.subscribe((eventMapping) => {
      expect(eventMapping).toEqual(mockEventMapping);
    });
    expect(eventMappingsService.getEventMapping).toHaveBeenCalledWith(1);
  });

  it('should navigate to the event mappings path with queryParams on delete confirmed', () => {
    component.onDeleteConfirmed();
    expect(eventMappingsService.deleteEventMapping).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['admin/system-configuration/event-mappings'], {
      queryParams: { deleteEventMapping: true },
    });
  });

  it('should navigate to the edit path on delete cancelled', () => {
    component.onDeleteCancelled();
    expect(router.navigate).toHaveBeenCalledWith(['admin/system-configuration/event-mappings', 1, 'edit']);
  });
});
