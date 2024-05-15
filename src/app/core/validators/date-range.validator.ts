import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export function dateRangeValidator(startDateControlKey: string, endDateControlKey: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const startDate = control.get(startDateControlKey)?.value;
    const endDate = control.get(endDateControlKey)?.value;

    const startDateTime = DateTime.fromFormat(startDate, 'dd/MM/yyyy');
    const endDateTime = DateTime.fromFormat(endDate, 'dd/MM/yyyy');

    // if times are valid and start date is after end date or end date is before start date
    if (startDateTime.isValid && endDateTime.isValid && (startDateTime > endDateTime || endDateTime < startDateTime)) {
      return { dateRange: true };
    }

    return null;
  };
}
