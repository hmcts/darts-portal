import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true,
})
export class JoinPipe implements PipeTransform {
  transform(input: undefined | Array<string | number>, sep = ', ', undef = '', lineBreak = false): string {
    if (!input || input?.length === 0) {
      return undef;
    }

    const separator = lineBreak ? '\n' : sep;

    return input.join(separator);
  }
}
