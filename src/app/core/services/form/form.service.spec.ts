import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldErrors } from '@core-types/index';
import { FormService } from './form.service';

describe('FormService', () => {
  let service: FormService;
  let form: FormGroup;
  let controlName: string;
  let controlErrors: FieldErrors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormService);

    form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    controlName = 'email';
    controlErrors = {
      email: {
        required: 'Email is required',
        email: 'Invalid email format',
      },
      password: {
        required: 'Password is required',
      },
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFormControlErrorMessages', () => {
    it('return an empty array if there are no errors', () => {
      form.setValue({ email: 'test@test.com', password: 'test123' });
      form.markAllAsTouched();

      const result = service.getFormControlErrorMessages(form, controlName, controlErrors);

      expect(result).toEqual([]);
    });

    it('return an array of error messages if there are errors and control is touched', () => {
      form.get(controlName)?.markAsTouched();

      const result = service.getFormControlErrorMessages(form, controlName, controlErrors);

      expect(result).toEqual(['Email is required']);
    });

    it('return an array of error messages for multiple errors and control is touched', () => {
      form.get(controlName)?.setErrors({ required: true, email: true });
      form.get(controlName)?.markAsTouched();

      const result = service.getFormControlErrorMessages(form, controlName, controlErrors);

      expect(result).toEqual(['Email is required', 'Invalid email format']);
    });

    it('return an empty array if there are errors and control is untouched', () => {
      form.get(controlName)?.markAsUntouched();
      form.get(controlName)?.setErrors({ required: true });

      const result = service.getFormControlErrorMessages(form, controlName, controlErrors);

      expect(result).toEqual([]);
    });
  });

  describe('getErrorSummary', () => {
    it('should return an empty array if there are no errors', () => {
      const result = service.getErrorSummary(form, controlErrors);
      expect(result).toEqual([]);
    });

    it('should return an array of error summary entries if there are errors', () => {
      const emailControl = form.get('email')!;

      emailControl.setErrors({ required: true });
      emailControl.markAsTouched();

      const result = service.getErrorSummary(form, controlErrors);

      expect(result).toEqual([{ fieldId: 'email', message: 'Email is required' }]);
    });

    it('should return an array of error summary entries for multiple errors', () => {
      const emailControl = form.get('email')!;
      emailControl.setErrors({ required: true, email: true });
      emailControl.markAsTouched();

      const result = service.getErrorSummary(form, controlErrors);

      expect(result).toEqual([
        { fieldId: 'email', message: 'Email is required' },
        { fieldId: 'email', message: 'Invalid email format' },
      ]);
    });

    it('should return an empty array if all controls are untouched', () => {
      form.get('email')?.setErrors({ required: true });
      form.get('password')?.setErrors({ required: true });
      form.get('email')?.markAsUntouched();
      form.get('password')?.markAsUntouched();

      const result = service.getErrorSummary(form, controlErrors);

      expect(result).toEqual([]);
    });

    it('should return an array of error summary entries for touched controls', () => {
      form.get('email')?.setErrors({ required: true });
      form.get('password')?.setErrors({ required: true });
      form.get('email')?.markAsTouched();
      form.get('password')?.markAsTouched();
      form.markAllAsTouched();

      const result = service.getErrorSummary(form, controlErrors);

      expect(result).toEqual([
        { fieldId: 'email', message: 'Email is required' },
        { fieldId: 'password', message: 'Password is required' },
      ]);
    });
  });

  describe('getControlErrorMessageWithControlPath', () => {
    it('should return an empty array if there are no errors', () => {
      form.get(controlName)?.markAsUntouched();

      const result = service.getControlErrorMessageWithControlPath(form, controlErrors, [controlName]);

      expect(result).toEqual([]);
    });

    it('should return an array of error messages if there are errors', () => {
      form.get(controlName)?.setErrors({ required: true });
      form.get(controlName)?.markAsTouched();

      const result = service.getControlErrorMessageWithControlPath(form, controlErrors, [controlName]);

      expect(result).toEqual(['Email is required']);
    });

    it('should return an array of error messages for multiple errors', () => {
      form.get(controlName)?.setErrors({ required: true, email: true });
      form.get(controlName)?.markAsTouched();

      const result = service.getControlErrorMessageWithControlPath(form, controlErrors, [controlName]);

      expect(result).toEqual(['Email is required']);
    });

    it('should return an empty array if there are errors and control is untouched', () => {
      form.get(controlName)?.setErrors({ required: true });
      form.get(controlName)?.markAsUntouched();

      const result = service.getControlErrorMessageWithControlPath(form, controlErrors, [controlName]);

      expect(result).toEqual([]);
    });
  });

  describe('getErrorSummaryRecursively', () => {
    it('should return an empty array if there are no errors', () => {
      form.setValue({ email: 'test@test.com', password: 'test123' });

      const result = service.getErrorSummaryRecursively(form, controlErrors);
      expect(result).toEqual([]);
    });

    it('should return an array of error summary entries if there are errors', () => {
      form.get('email')?.setErrors({ required: true });
      form.get('email')?.markAsTouched();
      form.get('password')?.setValue('test123');

      const result = service.getErrorSummaryRecursively(form, controlErrors);

      expect(result).toEqual([{ fieldId: 'email', message: 'Email is required' }]);
    });

    it('should return an array of error summary entries for multiple errors', () => {
      form.get('email')?.setErrors({ required: true, email: true });
      form.get('password')?.setErrors({ required: true });

      form.markAllAsTouched();

      const result = service.getErrorSummaryRecursively(form, controlErrors);

      expect(result).toEqual([
        { fieldId: 'email', message: 'Email is required' },
        { fieldId: 'password', message: 'Password is required' },
      ]);
    });
  });
});
