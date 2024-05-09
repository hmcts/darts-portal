import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const futureDateValidator = (control: AbstractControl): ValidationErrors | null => {
  const dateValue = control.value;

  if (!dateValue) return null;

  const dateFormat = 'dd/MM/yyyy';

  const inputDate = DateTime.fromFormat(dateValue, dateFormat);
  const currentDate = DateTime.now();

  if (currentDate.startOf('day') < inputDate.startOf('day')) {
    return { futureDate: true };
  }
  return null;
};
