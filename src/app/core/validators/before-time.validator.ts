import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const beforeTimeValidator = (control: AbstractControl): ValidationErrors | null => {
  const startTimeCtrl = control.get('startTime');
  const endTimeCtrl = control.get('endTime');

  if (startTimeCtrl?.invalid || endTimeCtrl?.invalid) {
    return null;
  }

  const startTime = DateTime.now().set({
    hour: startTimeCtrl?.get('hours')?.value,
    minute: startTimeCtrl?.get('minutes')?.value,
    second: startTimeCtrl?.get('seconds')?.value,
  });
  const endTime = DateTime.now().set({
    hour: endTimeCtrl?.get('hours')?.value,
    minute: endTimeCtrl?.get('minutes')?.value,
    second: endTimeCtrl?.get('seconds')?.value,
  });

  if (endTime <= startTime) {
    return { endTimeBeforeStartTime: true };
  }

  return null;
};
