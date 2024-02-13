import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayDisplay',
  standalone: true,
})
export class ArrayDisplayPipe implements PipeTransform {
  transform(arr: string[]): string {
    if (!arr || arr.length === 0) {
      return '';
    }
    if (arr.length < 2) {
      return arr[0];
    } else {
      return 'Multiple';
    }
  }
}
