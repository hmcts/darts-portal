import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanizeInitCap',
  standalone: true,
})
export class HumanizeInitCapPipe implements PipeTransform {
  transform(input: string): string {
    const humanized = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    return humanized.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  }
}
