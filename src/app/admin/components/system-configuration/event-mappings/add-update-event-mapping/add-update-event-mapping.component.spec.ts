import { EventMappingData } from '@admin-types/event-mappings/event-mapping.interface';
import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ErrorMessageService } from '@services/error/error-message.service';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { FormService } from '@services/form/form.service';
import { HeaderService } from '@services/header/header.service';
import { of } from 'rxjs';
import { AddUpdateEventMappingComponent } from './add-update-event-mapping.component';

jest.mock('@services/event-mappings/event-mappings.service');
jest.mock('@services/error/error-message.service');
jest.mock('@services/header/header.service');
jest.mock('@services/form/form.service');

describe('AddUpdateEventMappingComponent', () => {
  let component: AddUpdateEventMappingComponent;
  let fixture: ComponentFixture<AddUpdateEventMappingComponent>;

  const eventMappings = [
    {
      id: 1,
      type: '1000',
      subType: '1001',
      name: 'Event map 1',
      handler: 'StandardEventHandler',
      isActive: true,
      hasRestrictions: false,
      createdAt: '2024-05-05T12:00:00.000+01:00',
    },
    {
      id: 2,
      type: '1000',
      subType: '1001',
      name: 'Event map 2',
      handler: 'TranscriptionRequestHandler',
      isActive: false,
      hasRestrictions: true,
      createdAt: '2024-05-05T14:00:00.000+01:00',
    },
    {
      id: 3,
      type: '1010',
      subType: '1011',
      name: 'Mapping entry 3',
      handler: 'TranscriptionRequestHandler',
      isActive: true,
      hasRestrictions: true,
      createdAt: '2024-04-02T18:00:00.000+01:00',
    },
  ];

  const eventHandlers = ['StandardEventHandler', 'TranscriptionRequestHandler'];

  const eventMappingData: EventMappingData = {
    id: 0,
    type: '100',
    sub_type: '101',
    name: 'testing',
    handler: null,
    is_active: false,
    has_restrictions: false,
    created_at: '',
  };

  const eventMappingsService = {
    getEventMappings: jest.fn(),
    createEventMapping: jest.fn(),
    getEventHandlers: jest.fn(),
  };

  const errorMessageService = {
    errorMessage$: of(null),
    clearErrorMessage: jest.fn(),
  };

  const headerService = {
    hideNavigation: jest.fn(),
  };

  const formService = {
    getUniqueErrorSummary: jest.fn(),
    getFormControlErrorMessages: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(eventMappingsService, 'getEventMappings').mockReturnValue(of(eventMappings));
    jest.spyOn(eventMappingsService, 'getEventHandlers').mockReturnValue(of(eventHandlers));
    jest.spyOn(eventMappingsService, 'createEventMapping').mockReturnValue(of(eventMappingData));

    jest.spyOn(formService, 'getUniqueErrorSummary').mockReturnValue({ fieldId: 'id', message: 'message' });

    await TestBed.configureTestingModule({
      imports: [AddUpdateEventMappingComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } },
        { provide: EventMappingsService, useValue: eventMappingsService },
        { provide: ErrorMessageService, useValue: errorMessageService },
        { provide: HeaderService, useValue: headerService },
        { provide: FormService, useValue: formService },
        DatePipe,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateEventMappingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.form;
    expect(form.value).toEqual({
      type: '',
      subType: '',
      eventName: '',
      eventHandler: '',
      withRestrictions: false,
    });
  });

  it('should call hideNavigation on init', () => {
    expect(headerService.hideNavigation).toHaveBeenCalled();
  });

  it('should not submit the form when invalid', () => {
    component.form.reset();
    component.onSubmit();
    expect(eventMappingsService.createEventMapping).not.toHaveBeenCalled();
  });

  it('should submit the form when valid', () => {
    const navigateSpy = jest.spyOn(component.router, 'navigate');
    component.form.setValue({
      type: 'Test Type',
      subType: 'Test SubType',
      eventName: 'Test Event Name',
      eventHandler: 'Test Event Handler',
      withRestrictions: true,
    });
    component.onSubmit();
    expect(eventMappingsService.createEventMapping).toHaveBeenCalledWith(component.form.value, false);
    expect(navigateSpy).toHaveBeenCalledWith([component.eventMappingsPath], { queryParams: { newEventMapping: true } });
  });

  it('should assign id, and query params when in revision', () => {
    const navigateSpy = jest.spyOn(component.router, 'navigate');

    component.eventMapping = {
      id: 99,
    } as unknown as EventMapping;

    const formValue = {
      type: 'Test Type',
      subType: 'Test SubType',
      eventName: 'Test Event Name',
      eventHandler: 'Test Event Handler',
      withRestrictions: true,
    };

    component.form.setValue(formValue);
    component.isRevision = true;
    component.onSubmit();
    expect(eventMappingsService.createEventMapping).toHaveBeenCalledWith({ ...formValue, id: 99 }, true);
    expect(navigateSpy).toHaveBeenCalledWith([component.eventMappingsPath], { queryParams: { isRevision: true } });
  });

  it('should navigate on cancel', () => {
    const navigateSpy = jest.spyOn(component.router, 'navigate');

    component.onCancel();

    expect(navigateSpy).toHaveBeenCalledWith([component.eventMappingsPath]);
  });

  it('should set unique type error to true for type and subType on 409', () => {
    expect(component.uniqueTypeError).toEqual(false);
    component.setResponseErrors({ status: 409 });
    expect(component.uniqueTypeError).toEqual(true);
  });

  it('should set default form values in revision mode', () => {
    component.isRevision = true;
    component.id = 1;
    component['setEventMapping'](eventMappings as unknown as EventMapping[]);

    expect(component.form.value).toEqual({
      type: '1000',
      subType: '1001',
      eventName: 'Event map 1',
      eventHandler: 'StandardEventHandler',
      withRestrictions: false,
    });
  });

  it('should navigate away if event mapping is not found or is inactive', () => {
    const navigateSpy = jest.spyOn(component.router, 'navigate');
    component.isRevision = true;
    component.id = 2;

    component['setEventMapping'](eventMappings as unknown as EventMapping[]); // event with id 2 is inactive

    expect(navigateSpy).toHaveBeenCalledWith([component.eventMappingsPath]);
  });

  it('should navigate away if id not found in mappings', () => {
    const navigateSpy = jest.spyOn(component.router, 'navigate');
    component.isRevision = true;
    component.id = 999; // non-existent ID

    component['setEventMapping'](eventMappings as unknown as EventMapping[]);

    expect(navigateSpy).toHaveBeenCalledWith([component.eventMappingsPath]);
  });

  it('should not set uniqueTypeError if isRevision is true even when status is 409', () => {
    component.isRevision = true;
    component.setResponseErrors({ status: 409 });

    expect(component.uniqueTypeError).toBe(false);
  });
});
