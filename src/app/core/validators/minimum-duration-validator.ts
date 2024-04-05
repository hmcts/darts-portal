import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minimumDurationValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const years = control.get('years');
  const months = control.get('months');
  const days = control.get('days');

  // check if each field is a number
  if (isNaN(years?.value) || isNaN(months?.value) || isNaN(days?.value)) {
    return { minimumDuration: true };
  }

  // check if each field is at least 1
  if (years?.value < 1 && months?.value < 1 && days?.value < 1) {
    return { minimumDuration: true };
  }

  return null;
};
