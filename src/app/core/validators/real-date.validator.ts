import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export const realDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const dateValue = control.value;

  if (!dateValue) return null;

  const dateFormat = 'dd/MM/yyyy';

  if (!DateTime.fromFormat(dateValue, dateFormat).isValid) {
    return { realDate: true };
  }
  return null;
};
