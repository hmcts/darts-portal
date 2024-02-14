import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'dateTime',
  standalone: true,
})
export class DateTimePipe implements PipeTransform {
  transform(value: DateTime | undefined, format: string): string | null {
    if (!value) {
      return null;
    }
    return value.toFormat(format);
  }
}
