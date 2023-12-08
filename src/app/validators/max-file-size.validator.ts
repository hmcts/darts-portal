import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maxFileSizeValidator(maxSizeInMB: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const fileSizeInBytes = (control.value as File)?.size;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (fileSizeInBytes && fileSizeInBytes > maxSizeInBytes) {
      return { maxFileSize: { maxSizeInMB } };
    }

    return null;
  };
}
