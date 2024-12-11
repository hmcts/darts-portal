import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Navigation, provideRouter, Router } from '@angular/router';
import { AutomatedTaskEditFormErrorMessages } from '@constants/automated-task-edit-error-messages';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { EDIT_PROPERTY_MAP, EditAutomatedTaskComponent, type EditType } from './edit-automated-task.component';

const INPUT_TYPE_PROPERTIES = Object.fromEntries(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(EDIT_PROPERTY_MAP).filter(([_, value]) => ['number', 'string'].includes(value.type))
);
const DATETIME_TYPE_PROPERTIES = Object.fromEntries(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(EDIT_PROPERTY_MAP).filter(([_, value]) => value.type === 'datetime')
);

describe('ChangeBatchSizeComponent', () => {
  let component: EditAutomatedTaskComponent;
  let fixture: ComponentFixture<EditAutomatedTaskComponent>;
  let router: Router;
  let automatedTasksService: AutomatedTasksService;
  let routerNavigateSpy: jest.SpyInstance;

  const createTaskState = (task: Partial<AutomatedTaskDetails>): Partial<AutomatedTaskDetails> => {
    const result = { ...task };

    // Define keys that need to be converted to ISO string
    const dateKeys = new Set(['rpoCsvStartHour', 'rpoCsvEndHour', 'armReplayStartTs', 'armReplayEndTs']);

    for (const key in result) {
      const typedKey = key as keyof AutomatedTaskDetails;
      if (dateKeys.has(typedKey) && result[typedKey] instanceof DateTime) {
        const isoString = (result[typedKey] as DateTime).toISO();
        if (isoString !== null) {
          result[typedKey] = isoString as unknown as undefined;
        }
      }
    }

    return result;
  };

  const setup = (edit?: EditType, task?: Partial<AutomatedTaskDetails>) => {
    TestBed.configureTestingModule({
      imports: [EditAutomatedTaskComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        {
          provide: AutomatedTasksService,
          useValue: {
            changeFieldValue: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
    });

    const taskState = createTaskState(task!);
    router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
    jest
      .spyOn(router, 'getCurrentNavigation')
      .mockReturnValue({ extras: { state: { automatedTask: taskState, edit: edit } } } as unknown as Navigation);

    fixture = TestBed.createComponent(EditAutomatedTaskComponent);
    component = fixture.componentInstance;
    component.task = task as AutomatedTaskDetails;

    automatedTasksService = TestBed.inject(AutomatedTasksService);
    fixture.detectChanges();
  };

  Object.keys(INPUT_TYPE_PROPERTIES).forEach((key: EditType) => {
    const editProperty = INPUT_TYPE_PROPERTIES[key];
    describe(`${key} edit - task provided`, () => {
      beforeEach(() => {
        setup(key, { id: 1, [editProperty.key]: 10 });
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should set form value to existing task value', () => {
        expect(component.form.controls[editProperty.key].value).toBe(10);
      });

      it('less than 0', () => {
        component.form.get(editProperty.key)?.setValue(0);
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(
          AutomatedTaskEditFormErrorMessages[editProperty.key].min
        );
      });

      it('greater than 2,147,483,647', () => {
        component.form.get(editProperty.key)?.setValue(2147483648);
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(
          AutomatedTaskEditFormErrorMessages[editProperty.key].max
        );
      });

      it('not an integer', () => {
        component.form.get(editProperty.key)?.setValue('abc' as unknown as number);
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(
          AutomatedTaskEditFormErrorMessages[editProperty.key].pattern
        );
      });

      it('required', () => {
        component.form.get(editProperty.key)?.setValue(null as unknown as number);
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(
          AutomatedTaskEditFormErrorMessages[editProperty.key].required
        );
      });

      it('should call changeFieldValue and navigate on valid submit', () => {
        component.form.get(editProperty.key)?.setValue(5);
        component.onSubmit();
        expect(automatedTasksService.changeFieldValue).toHaveBeenCalledWith(1, editProperty.api_key, 5);
        expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], {
          relativeTo: TestBed.inject(ActivatedRoute),
          queryParams: { labelChanged: editProperty.label },
        });
      });

      it('should not call changeBatchSize and navigate on invalid submit', () => {
        component.form.get(editProperty.key)?.setValue(0);
        component.onSubmit();
        expect(automatedTasksService.changeFieldValue).not.toHaveBeenCalled();
        expect(routerNavigateSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('task not provided', () => {
    it('should navigate back to automated tasks if task is undefined', () => {
      setup();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: TestBed.inject(ActivatedRoute) });
    });
  });

  Object.keys(DATETIME_TYPE_PROPERTIES).forEach((key: EditType) => {
    const editProperty = DATETIME_TYPE_PROPERTIES[key];

    describe(`${key} valid datetime edit`, () => {
      beforeEach(() => {
        setup(key, { id: 1, [editProperty.key]: DateTime.fromISO('2023-01-01T12:30:00.000Z') });
      });

      it('should set date and time input value non-BST', () => {
        expect(component.form.controls.date.value).toBe('01/01/2023');
        expect(component.form.controls.time.value).toEqual({ hours: '12', minutes: '30', seconds: '00' });
      });

      it('date is required', () => {
        component.form.controls.date.setValue('');
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.date.required);
      });

      it('date is not in the correct format', () => {
        component.form.controls.date.setValue('2023-05-15');
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBeGreaterThan(0);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.date.pattern);
      });

      it('date is invalid (e.g., 31/02/2023)', () => {
        component.form.controls.date.setValue('31/02/2023');
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.date.invalidDate);
      });

      it('date is required', () => {
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.hours.setValue('');
        timeGroup.controls.minutes.setValue('');
        timeGroup.controls.seconds.setValue('');

        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.time.required);
      });

      it('hours are out of range', () => {
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.hours.setValue('24'); // Invalid hour
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.time.invalidTime);
      });

      it('minutes are out of range', () => {
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.minutes.setValue('60'); // Invalid minute
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.time.invalidTime);
      });

      it('seconds are out of range', () => {
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.seconds.setValue('60'); // Invalid second
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.time.invalidTime);
      });

      it('hours do not match pattern (e.g., single-digit hour)', () => {
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.hours.setValue('5'); // Should be two digits
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.time.pattern);
      });

      it('minutes do not match pattern (e.g., single-digit minute)', () => {
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.minutes.setValue('5'); // Should be two digits
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.time.pattern);
      });

      it('seconds do not match pattern (e.g., single-digit second)', () => {
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.seconds.setValue('5'); // Should be two digits
        component.onSubmit();
        expect(component.validationErrorSummary.length).toBe(1);
        expect(component.validationErrorSummary[0].message).toBe(AutomatedTaskEditFormErrorMessages.time.pattern);
      });

      it('should call changeDateTime and navigate on valid submit', () => {
        component.form.controls.date.setValue('09/01/2023');
        const timeGroup = component.form.controls.time as FormGroup;
        timeGroup.controls.hours.setValue('18');
        timeGroup.controls.minutes.setValue('30');
        timeGroup.controls.seconds.setValue('45');
        component.onSubmit();
        expect(component.dateLabel).toBe(editProperty.label);
        expect(automatedTasksService.changeFieldValue).toHaveBeenCalledWith(
          1,
          editProperty.api_key,
          DateTime.fromISO('2023-01-09T18:30:45.000Z')
        );
        expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], {
          relativeTo: TestBed.inject(ActivatedRoute),
          queryParams: { labelChanged: editProperty.label },
        });
      });
    });
  });
});
