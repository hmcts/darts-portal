import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const pastDateValidator = (control: AbstractControl): ValidationErrors | null => {
  const dateValue = control.value;

  if (!dateValue) return null;

  const dateFormat = 'dd/MM/yyyy';

  if (!DateTime.fromFormat(dateValue, dateFormat).isValid) {
    return { pattern: true };
  }

  const inputDate = DateTime.fromFormat(dateValue, dateFormat);
  const currentDate = DateTime.now();

  if (currentDate.startOf('day') > inputDate.startOf('day')) {
    return { pastDate: true };
  }
  return null;
};
