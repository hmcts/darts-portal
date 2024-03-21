import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '-';
    }
    return value.toLowerCase().replace('y', 'y ').replace('m', 'm ');
  }
}
