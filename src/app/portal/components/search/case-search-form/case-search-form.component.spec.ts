import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ErrorSummaryEntry } from '@core-types/index';
import { CaseSearchFormValues } from '@portal-types/case';
import { ErrorMessageService } from '@services/error/error-message.service';
import { FormService } from '@services/form/form.service';
import { TODAY, TOMORROW, YESTERDAY } from '@utils/index';
import { CaseSearchFormComponent } from './case-search-form.component';

const mockFormValues: CaseSearchFormValues = {
  courthouse: 'Cardiff',
  hearingDate: {
    type: 'specific',
    specific: '01/01/2022',
    from: '',
    to: '',
  },
  caseNumber: '',
  courtroom: '',
  judgeName: '',
  defendantName: '',
  eventTextContains: '',
};

describe('CaseSearchFormComponent', () => {
  let component: CaseSearchFormComponent;
  let fixture: ComponentFixture<CaseSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseSearchFormComponent],
      providers: [FormService, ErrorMessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseSearchFormComponent);
    fixture.componentRef.setInput('courthouses', [{ id: 1, name: 'Cardiff', code: 'CARDIFF', displayName: 'Cardiff' }]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    describe('courthouse and courtroom', () => {
      it('courthouse required when courtroom has a value', () => {
        component.form.controls.courthouse.setValue('');
        component.form.controls.courtroom.setValue('1');
        expect(component.form.controls.courthouse.hasError('required')).toBe(true);
      });

      it('courthouse not required when courtroom has no value', () => {
        component.form.controls.courthouse.setValue('');
        component.form.controls.courtroom.setValue('');
        expect(component.form.controls.courthouse.hasError('required')).toBe(false);
      });

      it('error messages should be displayed when courthouse is required', () => {
        component.form.controls.courthouse.setValue('');
        component.form.controls.courtroom.setValue('1');

        component.onSubmit();
        fixture.detectChanges();

        const inlineError = fixture.debugElement.query(By.css('#courthouse-errors'));
        expect(inlineError.nativeElement.textContent).toContain('You must also enter a courthouse');
      });
    });

    describe('hearing date', () => {
      let specificFormControl: FormControl;
      let fromFormControl: FormControl;
      let toFormControl: FormControl;

      beforeEach(() => {
        specificFormControl = component.form.controls.hearingDate.controls.specific;
        fromFormControl = component.form.controls.hearingDate.controls.from;
        toFormControl = component.form.controls.hearingDate.controls.to;
      });

      it('past dates are valid', () => {
        specificFormControl.setValue(YESTERDAY);
        toFormControl.setValue(YESTERDAY);
        fromFormControl.setValue(YESTERDAY);
        expect(specificFormControl.hasError('futureDate')).toBe(false);
        expect(toFormControl.hasError('futureDate')).toBe(false);
        expect(fromFormControl.hasError('futureDate')).toBe(false);
      });

      it('today is valid', () => {
        specificFormControl.setValue(TODAY);
        toFormControl.setValue(TODAY);
        fromFormControl.setValue(TODAY);
        expect(specificFormControl.hasError('futureDate')).toBe(false);
        expect(toFormControl.hasError('futureDate')).toBe(false);
        expect(fromFormControl.hasError('futureDate')).toBe(false);
      });

      it('future dates are invalid', () => {
        specificFormControl.setValue(TOMORROW);
        toFormControl.setValue(TOMORROW);
        fromFormControl.setValue(TOMORROW);
        expect(specificFormControl.hasError('futureDate')).toBe(true);
        expect(toFormControl.hasError('futureDate')).toBe(true);
        expect(fromFormControl.hasError('futureDate')).toBe(true);
      });

      it('dates are invalid if not correctly formatted', () => {
        specificFormControl.setValue('bla');
        toFormControl.setValue('bla');
        fromFormControl.setValue('bla');
        expect(specificFormControl.hasError('pattern')).toBe(true);
        expect(toFormControl.hasError('pattern')).toBe(true);
        expect(fromFormControl.hasError('pattern')).toBe(true);
      });

      it('to date must be before from date', () => {
        fromFormControl.setValue('02/09/2023');
        toFormControl.setValue('01/09/2022');
        expect(toFormControl.hasError('dateRange')).toBe(true);
      });

      it('from date must be after to date', () => {
        fromFormControl.setValue('01/09/2022');
        toFormControl.setValue('02/09/2023');
        expect(fromFormControl.hasError('dateRange')).toBe(false);
      });

      it('to date is required when from date has a value', () => {
        fromFormControl.setValue('01/09/2023');
        expect(toFormControl.hasError('required')).toBe(true);
      });

      it('to date is not required when from date is empty', () => {
        fromFormControl.setValue('');
        expect(toFormControl.hasError('required')).toBe(false);
      });

      it('from date is required when to date has a value', () => {
        toFormControl.setValue('01/09/2023');
        expect(fromFormControl.hasError('required')).toBe(true);
      });

      it('from date is not required when to date is empty', () => {
        toFormControl.setValue('');
        expect(fromFormControl.hasError('required')).toBe(false);
      });
    });
  });

  describe('form submission', () => {
    it('should submit when search button is clicked', () => {
      jest.spyOn(component, 'onSubmit');
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('call error message service if form is not dirty', () => {
      const errorMsgServiceSpy = jest.spyOn(TestBed.inject(ErrorMessageService), 'setErrorMessage');
      component.form.markAsPristine();

      component.onSubmit();

      expect(errorMsgServiceSpy).toHaveBeenCalledWith({
        detail: { type: 'CASE_101' },
        status: 204,
        display: 'COMPONENT',
      });
    });

    it('should emit form values when form is valid and submitted', () => {
      const searchOutputSpy = jest.spyOn(component.search, 'emit');
      component.form.patchValue(mockFormValues);
      component.form.markAsDirty();
      component.onSubmit();
      expect(searchOutputSpy).toHaveBeenCalledWith(mockFormValues);
    });
  });

  describe('courthouse selection', () => {
    it('should handle courthouse selection correctly', () => {
      const courthouse = 'Test Courthouse';
      component.onCourthouseSelected(courthouse);

      const courthouseControl = component.form.get('courthouse');
      expect(courthouseControl?.value).toBe(courthouse);
      expect(courthouseControl?.dirty).toBe(true);
    });
  });

  describe('#getFieldErrorMessages', () => {
    it('should get inline error messages correctly', () => {
      const fieldName = 'courthouse';

      component.form.controls[fieldName].setErrors({ required: true });
      component.form.controls.courthouse.markAsTouched();

      const errorMessages: string[] = component.getFieldErrorMessages(fieldName);

      expect(errorMessages).toEqual(['You must also enter a courthouse']);
    });
  });

  describe('error summary', () => {
    it('should generate error summary correctly', () => {
      component.form.controls.courthouse.setErrors({ required: true });
      component.form.controls.courthouse.markAsTouched();

      const errorSummary: ErrorSummaryEntry[] = component.generateErrorSummary();

      expect(errorSummary).toEqual([{ fieldId: 'courthouse', message: 'You must also enter a courthouse' }]);
    });

    it('error summary should contain no errors when form is valid and submitted', () => {
      const errorOutputSpy = jest.spyOn(component.validationError, 'emit');

      component.onSubmit();

      expect(errorOutputSpy).toHaveBeenCalledWith([]);
    });

    it('generate error summary when form is invalid and submitted', () => {
      component.isSubmitted.set(true);
      component.form.controls.hearingDate.controls.specific.setValue('bla');

      component.onSubmit();

      expect(component.generateErrorSummary()).toEqual([
        {
          fieldId: 'specific',
          message: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
        },
      ]);
    });
  });

  describe('restore form previous state', () => {
    it('should restore form values when previousFormValues is defined and range was previously selected', () => {
      const previousFormValues: CaseSearchFormValues = {
        courthouse: 'Cardiff',
        hearingDate: {
          type: 'range',
          specific: '',
          from: '2022-09-01',
          to: '2022-09-30',
        },
        caseNumber: '',
        courtroom: '',
        judgeName: '',
        defendantName: '',
        eventTextContains: '',
      };

      fixture.componentRef.setInput('formValues', previousFormValues);
      fixture.detectChanges();
      component.restoreForm();

      expect(component.isAdvancedSearch).toBeTruthy();
      expect(component.courthouse()).toEqual(previousFormValues.courthouse);
      expect(component.form.value).toEqual(previousFormValues);
      expect(component.form.dirty).toBeTruthy();
      expect(component.isSubmitted).toBeTruthy();
    });

    it('should restore form values when previousFormValues is defined and specific date was previously selected', () => {
      const previousFormValues: CaseSearchFormValues = {
        caseNumber: '',
        courthouse: 'Cardiff',
        hearingDate: {
          type: 'specific',
          specific: '2022-09-01',
          from: '',
          to: '',
        },
        courtroom: '',
        judgeName: '',
        defendantName: '',
        eventTextContains: '',
      };

      fixture.componentRef.setInput('formValues', previousFormValues);
      fixture.detectChanges();

      component.restoreForm();

      expect(component.isAdvancedSearch).toBeTruthy();
      expect(component.courthouse()).toEqual(previousFormValues.courthouse);
      expect(component.form.value).toEqual(previousFormValues);
      expect(component.form.dirty).toBeTruthy();
      expect(component.isSubmitted).toBeTruthy();
    });
  });
});
