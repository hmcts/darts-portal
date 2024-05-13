import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { EventMappingComponent } from './event-mappings.component';

describe('EventMappingComponent', () => {
  let component: EventMappingComponent;
  let fixture: ComponentFixture<EventMappingComponent>;
  let mockEventMappingsService: Partial<EventMappingsService>;

  const eventMappings: EventMapping[] = [
    {
      id: 1,
      type: 'Type1',
      subType: 'SubType1',
      name: 'Event1',
      handler: 'Handler1',
      hasRestrictions: true,
      createdAt: DateTime.fromISO('2024-05-25T09:08:34.123'),
      isActive: true,
    },
    {
      id: 2,
      type: 'Type2',
      subType: 'SubType2',
      name: 'Event2',
      handler: 'Handler2',
      hasRestrictions: true,
      createdAt: DateTime.fromISO('2024-05-25T09:08:34.123'),
      isActive: false,
    },
    {
      id: 3,
      type: 'Type3',
      subType: 'SubType3',
      name: 'Event3',
      handler: 'Handler3',
      hasRestrictions: false,
      createdAt: DateTime.fromISO('2024-05-25T09:08:34.123'),
      isActive: false,
    },
  ];

  beforeEach(async () => {
    mockEventMappingsService = {
      getEventMappings: jest.fn(),
      getEventHandlers: jest.fn(),
    };

    jest.spyOn(mockEventMappingsService, 'getEventMappings').mockReturnValue(of(eventMappings));
    jest.spyOn(mockEventMappingsService, 'getEventHandlers').mockReturnValue(of(['Handler1', 'Handler2']));

    await TestBed.configureTestingModule({
      providers: [{ provide: EventMappingsService, useValue: mockEventMappingsService }, DatePipe, LuxonDatePipe],
      imports: [EventMappingComponent, CommonModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EventMappingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes with default form values and fetches data', () => {
    expect(component.formValues.getValue()).toEqual({
      searchText: '',
      eventHandler: '',
      statusFilter: 'active',
      withRestrictions: true,
      withoutRestrictions: true,
    });
    expect(mockEventMappingsService.getEventMappings).toHaveBeenCalled();
    expect(mockEventMappingsService.getEventHandlers).toHaveBeenCalled();
  });

  it('should filter event mappings correctly based on form changes', () => {
    let result;
    component.filteredEventMappings$.subscribe((filtered) => {
      result = filtered;
    });

    // Trigger form value change
    component.onFormValuesChange({
      searchText: 'type',
      eventHandler: '',
      statusFilter: 'active',
      withRestrictions: true,
      withoutRestrictions: true,
    });

    expect(result!.length).toBe(1);
    expect(result![0].name).toEqual('Event1');
    expect(result![0].isActive).toEqual(true);

    let result1;
    component.filteredEventMappings$.subscribe((filtered) => {
      result1 = filtered;
    });

    component.onFormValuesChange({
      searchText: '',
      eventHandler: '',
      statusFilter: 'activeAndInactive',
      withRestrictions: true,
      withoutRestrictions: true,
    });

    expect(result1!.length).toBe(3);
  });

  it('should filter event mappings correctly based on search text form changes', () => {
    let result;
    component.filteredEventMappings$.subscribe((filtered) => {
      result = filtered;
    });

    // Trigger form value change
    component.onFormValuesChange({
      searchText: 'Type1',
      eventHandler: '',
      statusFilter: 'active',
      withRestrictions: true,
      withoutRestrictions: true,
    });

    expect(result!.length).toBe(1);
    expect(result![0].type).toEqual('Type1');
    expect(result![0].isActive).toEqual(true);
  });

  it('should filter event mappings correctly based on restriction booleans', () => {
    let result;
    component.filteredEventMappings$.subscribe((filtered) => {
      result = filtered;
    });

    // Trigger form value change
    component.onFormValuesChange({
      searchText: '',
      eventHandler: '',
      statusFilter: 'activeAndInactive',
      withRestrictions: false,
      withoutRestrictions: true,
    });

    expect(result!.length).toBe(1);
    expect(result![0].subType).toEqual('SubType3');
    expect(result![0].hasRestrictions).toEqual(false);
  });
});
