import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  private readonly bytesInKb = 1024;
  private readonly bytesInMb = 1024 * 1024;

  transform(bytes: number): string {
    if (bytes < this.bytesInMb) {
      const kb = bytes / this.bytesInKb;
      return `${kb.toFixed(2)}KB`;
    } else {
      const mb = bytes / this.bytesInMb;
      return `${mb.toFixed(2)}MB`;
    }
  }
}
