import { AbstractControl, ValidationErrors } from '@angular/forms';
import moment from 'moment';

export const futureDateValidator = (control: AbstractControl): ValidationErrors | null => {
  const dateValue = control.value;

  if (!dateValue) return null;

  const dateFormat = 'DD/MM/YYYY';

  if (!moment(dateValue, dateFormat, true).isValid()) {
    return { invalidDate: true };
  }

  const inputDate = moment(dateValue, dateFormat);
  const currentDate = moment();

  if (inputDate.isAfter(currentDate)) {
    return { futureDate: true };
  }
  return null;
};
