import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const beforeDateValidator = (control: AbstractControl, beforeDate: string | null): ValidationErrors | null => {
  const dateValue = control.value;

  if (!dateValue || !beforeDate) return null;

  const dateFormat = 'dd/MM/yyyy';

  if (!DateTime.fromFormat(dateValue, dateFormat).isValid) {
    return { pattern: true };
  }

  const inputDate = DateTime.fromFormat(dateValue, dateFormat);
  const pastDate = DateTime.fromFormat(beforeDate, dateFormat);

  if (pastDate.startOf('day') > inputDate.startOf('day')) {
    return { beforeDate: true };
  }
  return null;
};
