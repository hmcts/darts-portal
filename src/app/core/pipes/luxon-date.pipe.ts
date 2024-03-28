import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxonDate',
  standalone: true,
})
export class LuxonDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: DateTime | undefined, format: string): string | null {
    if (!value) {
      return null;
    }
    return this.datePipe.transform(value.toISO(), format);
  }
}
