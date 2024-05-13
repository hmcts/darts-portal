import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EventMappingFormComponent } from './event-mapping-form.component';

describe('EventMappingFormComponent', () => {
  let component: EventMappingFormComponent;
  let fixture: ComponentFixture<EventMappingFormComponent>;
  let mockEmitFunction: jest.Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EventMappingFormComponent],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(EventMappingFormComponent);
    component = fixture.componentInstance;
    mockEmitFunction = jest.fn();
    component.filterValues.emit = mockEmitFunction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes the form with default values', () => {
    expect(component.form.value).toEqual({
      searchText: '',
      eventHandler: '',
      statusFilter: 'active',
      withRestrictions: true,
      withoutRestrictions: true,
    });
  });

  it('emits form values when onChange is called', () => {
    component.form.setValue({
      searchText: 'test',
      eventHandler: 'handle1',
      statusFilter: 'inactive',
      withRestrictions: false,
      withoutRestrictions: false,
    });
    component.onChange(); // Simulate the call to onChange
    expect(mockEmitFunction).toHaveBeenCalledWith({
      searchText: 'test',
      eventHandler: 'handle1',
      statusFilter: 'inactive',
      withRestrictions: false,
      withoutRestrictions: false,
    });
  });

  it('resets restrictions checkboxes when both are false', () => {
    component.form.setValue({
      searchText: 'test',
      eventHandler: 'handle2',
      statusFilter: 'active',
      withRestrictions: false,
      withoutRestrictions: false,
    });
    component.onChange(); // This should trigger the checkbox correction logic
    expect(component.form.value.withRestrictions).toBe(true);
    expect(component.form.value.withoutRestrictions).toBe(true);
  });
});
