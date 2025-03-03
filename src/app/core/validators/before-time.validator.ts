import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const beforeTimeValidator = (control: AbstractControl): ValidationErrors | null => {
  const startTimeCtrl = control.get('startTime');
  const endTimeCtrl = control.get('endTime');

  if (!startTimeCtrl || !endTimeCtrl) return null;

  if (startTimeCtrl.dirty || endTimeCtrl.dirty) {
    startTimeCtrl.updateValueAndValidity({ onlySelf: true });
    endTimeCtrl.updateValueAndValidity({ onlySelf: true });
  }

  if (startTimeCtrl.invalid || endTimeCtrl.invalid) return null;

  const now = DateTime.now();

  const startTime = now.set({
    hour: startTimeCtrl.get('hours')?.value ?? 0,
    minute: startTimeCtrl.get('minutes')?.value ?? 0,
    second: startTimeCtrl.get('seconds')?.value ?? 0,
  });

  const endTime = now.set({
    hour: endTimeCtrl.get('hours')?.value ?? 0,
    minute: endTimeCtrl.get('minutes')?.value ?? 0,
    second: endTimeCtrl.get('seconds')?.value ?? 0,
  });

  const currentErrors = endTimeCtrl.errors || {};

  if (endTime <= startTime) {
    endTimeCtrl.setErrors({ ...currentErrors, endTimeAfterStart: true });
    return { endTimeBeforeStartTime: true };
  }

  if (currentErrors.endTimeAfterStart) {
    const { endTimeBeforeStartTime, ...otherErrors } = currentErrors;
    endTimeCtrl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
  }

  return null;
};
