import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytes',
  standalone: true,
})
export class BytesPipe implements PipeTransform {
  transform(bytes: number, unit: 'KB' | 'MB' | 'GB' = 'MB'): number {
    if (bytes === 0) {
      return 0;
    }
    if (unit === 'KB') {
      return bytes / 1024;
    }
    if (unit === 'MB') {
      return bytes / (1024 * 1024);
    }
    if (unit === 'GB') {
      return bytes / (1024 * 1024 * 1024);
    }

    return 0;
  }
}
