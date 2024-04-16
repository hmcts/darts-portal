import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export const pastDateTimeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const hours = control.get('startTime.hours')?.value;
  const minutes = control.get('startTime.minutes')?.value;
  const date = control.get('startDate')?.value;

  const dateTimeString = `${date} ${hours}:${minutes}`;

  const time = DateTime.fromFormat(dateTimeString, 'dd/MM/yyyy HH:mm');
  const now = DateTime.now();

  if (time.isValid && time < now) {
    return { pastDateTime: true };
  }

  return null;
};
