import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxonDate',
  standalone: true,
})
export class LuxonDatePipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  transform(value: DateTime | undefined, format: string): string | null {
    if (!value?.isValid) {
      return null;
    }
    return this.datePipe.transform(value.toISO(), format);
  }
}
