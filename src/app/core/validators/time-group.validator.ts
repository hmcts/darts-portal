import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export const timeGroupValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const hours = control.get('hours');
  const minutes = control.get('minutes');
  const seconds = control.get('seconds');

  if (hours?.hasError('required') || minutes?.hasError('required') || seconds?.hasError('required')) {
    return { required: true };
  }

  // using luxon, check if combined fields are a valid time
  const timeString = `${hours?.value}:${minutes?.value}:${seconds?.value || '00'}`;
  const time = DateTime.fromFormat(timeString, 'HH:mm:ss');
  return time.isValid ? null : { invalidTime: true };
};
