import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true,
})
export class JoinPipe implements PipeTransform {
  transform(input: undefined | Array<string | number>, sep = ', '): string {
    return input?.join(sep) ?? '';
  }
}
