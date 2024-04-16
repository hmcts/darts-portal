import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RetentionPolicy, RetentionPolicyForm } from '@admin-types/index';
import { SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RetentionPolicyErrorCode } from '@constants/retention-policy-error-codes';
import { RetentionPolicyFormErrorMessages } from '@constants/retention-policy-form-error-messages';
import { DateTime } from 'luxon';
import { RetentionFormContext } from '../create-edit-retention-policy/create-edit-retention-policy.component';
import { RetentionPolicyFormComponent } from './retention-policy-form.component';

type formValidationTestCase = {
  name: string;
  data: RetentionPolicyForm;
  validity: boolean;
  errorMessage?: string;
  context?: RetentionFormContext;
  onSubmit?: boolean;
};

// Factory function to create a Valid RetentionPolicyForm object
// with the option to override any properties
export const formDataFactory = (data?: Partial<RetentionPolicyForm>): RetentionPolicyForm => ({
  name: 'test',
  displayName: 'test',
  description: 'test',
  fixedPolicyKey: '1',
  duration: {
    years: '1',
    months: '0',
    days: '0',
  },
  startDate: '01/01/2025',
  startTime: {
    hours: '11',
    minutes: '11',
  },
  ...data,
});

const formValidationTestCases: formValidationTestCase[] = [
  {
    name: 'all fields are valid',
    data: formDataFactory({}),
    validity: true,
  },
  {
    name: 'name is empty',
    data: formDataFactory({ name: '' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.name.required,
  },
  {
    name: 'name is not unique',
    data: formDataFactory({ name: 'non-unique name' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.name.unique,
  },
  {
    name: 'displayName is empty',
    data: formDataFactory({ displayName: '' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.displayName.required,
  },
  {
    name: 'displayName is not unique',
    data: formDataFactory({ displayName: 'non-unique display name' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.displayName.unique,
  },
  {
    name: 'description is too long',
    data: formDataFactory({ description: 'a'.repeat(256) }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.description.maxlength,
  },
  {
    name: 'fixedPolicyKey is empty',
    data: formDataFactory({ fixedPolicyKey: '' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.fixedPolicyKey.required,
  },
  {
    name: 'fixedPolicyKey is not unique',
    data: formDataFactory({ fixedPolicyKey: '123' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.fixedPolicyKey.unique,
  },
  {
    name: 'duration is less than 1 day',
    data: formDataFactory({ duration: { years: '0', months: '0', days: '0' } }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.duration.minimumDuration,
  },
  {
    name: 'startDate is empty',
    data: formDataFactory({ startDate: '' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.startDate.required,
  },
  {
    name: 'startDate is not a future date',
    data: formDataFactory({ startDate: '01/01/2020' }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.startDate.pastDate,
  },
  {
    name: 'startDate is a future date',
    data: formDataFactory({ startDate: '01/01/3000' }),
    validity: true,
  },
  {
    name: 'startTime hours is empty',
    data: formDataFactory({ startTime: { hours: '', minutes: '00' } }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.startTime.required,
  },
  {
    name: 'startTime hours is not a number',
    data: formDataFactory({ startTime: { hours: 'a', minutes: '00' } }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.startTime.pattern,
  },
  {
    name: 'startTime hours is not a valid time',
    data: formDataFactory({ startTime: { hours: '24', minutes: '00' } }),
    validity: false,
  },
  {
    name: 'startTime minutes is empty',
    data: formDataFactory({ startTime: { hours: '00', minutes: '' } }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.startTime.required,
  },
  {
    name: 'startTime minutes is not a number',
    data: formDataFactory({ startTime: { hours: '00', minutes: 'a' } }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.startTime.pattern,
  },
  {
    name: 'startTime minutes is not a valid time',
    data: formDataFactory({ startTime: { hours: '00', minutes: '60' } }),
    validity: false,
    errorMessage: RetentionPolicyFormErrorMessages.startTime.invalidTime,
  },
  {
    name: 'startTime hours and minutes are valid',
    data: formDataFactory({ startTime: { hours: '00', minutes: '00' } }),
    validity: true,
  },
  {
    name: 'date is today but time is in the past',
    data: formDataFactory({
      startDate: DateTime.now().toFormat('dd/MM/yyyy'),
      startTime: { hours: '00', minutes: '00' },
    }),
    validity: false,
    onSubmit: true,
    errorMessage: RetentionPolicyFormErrorMessages.startTime.pastDateTime,
  },
  {
    name: 'date is today but time is in future',
    data: formDataFactory({
      startDate: DateTime.now().toFormat('dd/MM/yyyy'),
      startTime: { hours: '23', minutes: '59' },
    }),
    validity: true,
  },
];

describe('RetentionPolicyFormComponent', () => {
  let component: RetentionPolicyFormComponent;
  let fixture: ComponentFixture<RetentionPolicyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetentionPolicyFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RetentionPolicyFormComponent);
    component = fixture.componentInstance;
    component.policies = [
      { name: 'non-unique name', displayName: 'non-unique display name', fixedPolicyKey: '123' } as RetentionPolicy,
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onSubmit', () => {
    it('should emit the form value', () => {
      const emitSpy = jest.spyOn(component.submitPolicy, 'emit');
      const formValue = formDataFactory({});

      component.form.setValue(formValue);
      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith(formValue);
    });
  });

  describe('form validation', () => {
    formValidationTestCases.forEach((test) => {
      it(test.name, () => {
        component.context = test.context || 'create';
        component.form.setValue(test.data);
        expect(component.form.valid).toBe(test.validity);

        if (test.onSubmit) {
          component.onSubmit();
        }

        if (test.errorMessage) {
          component.form.markAllAsTouched();
          fixture.detectChanges();
          const errorMessages: string[] = fixture.debugElement
            .queryAll(By.css('.govuk-error-message'))
            .map((el) => el.nativeElement.textContent.trim());
          expect(errorMessages).toContain(`Error: ${test.errorMessage}`);
        }
      });
    });
  });

  describe('#getErrorMessages', () => {
    it('should return an array of error messages for a given control', () => {
      component.form.controls.name.setValue('');
      component.form.controls.name.markAsTouched();

      const errorMessages = component.getErrorMessages('name');

      expect(errorMessages).toEqual([RetentionPolicyFormErrorMessages.name.required]);
    });
  });

  describe('#isControlInvalid', () => {
    it('should return true if the control is invalid and touched', () => {
      component.form.get('name')?.setValue('');
      component.form.get('name')?.markAsTouched();
      expect(component.isControlInvalid('name')).toBe(true);
    });
  });

  describe('Create policy errors', () => {
    it('should map NON_UNIQUE_POLICY_NAME error to form', fakeAsync(() => {
      const error = RetentionPolicyErrorCode.NON_UNIQUE_POLICY_NAME;

      component.savePolicyError = error;

      component.ngOnChanges({ savePolicyError: { currentValue: error } } as unknown as SimpleChanges);

      tick();

      expect(component.form.controls.name.errors?.unique).toBe(true);
    }));

    it('should map NON_UNIQUE_POLICY_DISPLAY_NAME error to form', fakeAsync(() => {
      const error = RetentionPolicyErrorCode.NON_UNIQUE_POLICY_DISPLAY_NAME;

      component.savePolicyError = error;

      component.ngOnChanges({ savePolicyError: { currentValue: error } } as unknown as SimpleChanges);

      tick();

      expect(component.form.controls.displayName.errors?.unique).toBe(true);
    }));

    it('should map NON_UNIQUE_FIXED_POLICY_KEY error to form', fakeAsync(() => {
      const error = RetentionPolicyErrorCode.NON_UNIQUE_FIXED_POLICY_KEY;

      component.savePolicyError = error;

      component.ngOnChanges({ savePolicyError: { currentValue: error } } as unknown as SimpleChanges);

      tick();

      expect(component.form.controls.fixedPolicyKey.errors?.unique).toBe(true);
    }));

    it('should not set the form error when savePolicyError is null', fakeAsync(() => {
      component.savePolicyError = null;

      component.ngOnChanges({ savePolicyError: { currentValue: null } } as unknown as SimpleChanges);

      tick();

      expect(component.form.controls.name.errors?.unique).toBeUndefined();
    }));
  });

  describe('edit context', () => {
    it('populate form with policy data', () => {
      component.context = 'edit';
      const policy: RetentionPolicy = {
        id: 0,
        name: 'name',
        displayName: 'disp',
        description: 'desc',
        fixedPolicyKey: '33',
        duration: '1Y0M0D',
        policyStartAt: DateTime.fromISO('2025-01-01T01:02:00.000Z'),
        policyEndAt: null,
      };
      component.policies = [policy];
      component.policyId = 0;

      component.ngOnInit();

      expect(component.form.value).toEqual({
        name: 'name',
        displayName: 'disp',
        description: 'desc',
        fixedPolicyKey: '33',
        duration: { years: '1', months: '0', days: '0' },
        startDate: '01/01/2025',
        startTime: { hours: '01', minutes: '02' },
      });
    });
  });

  describe('create-revision context', () => {
    it('populate form with policy data', () => {
      component.context = 'create-revision';
      const policy: RetentionPolicy = {
        id: 0,
        name: 'name',
        displayName: 'disp',
        description: 'desc',
        fixedPolicyKey: '33',
        duration: '1Y0M0D',
        policyStartAt: DateTime.fromISO('2099-01-01T01:02:00.000Z'),
        policyEndAt: null,
      };
      component.policies = [policy];
      component.policyId = 0;

      component.ngOnInit();

      expect(component.form.value).toEqual({
        name: 'name',
        displayName: 'disp',
        description: 'desc',
        fixedPolicyKey: '33',
        duration: { years: '', months: '', days: '' },
        startDate: '',
        startTime: { hours: '', minutes: '' },
      });
    });
  });
});
