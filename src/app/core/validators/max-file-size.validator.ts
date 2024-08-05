import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maxFileSizeValidator(maxSizeInMB: number, message?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const fileSizeInBytes = (control.value as File)?.size;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (fileSizeInBytes && fileSizeInBytes > maxSizeInBytes) {
      return {
        maxFileSize: { message: message ?? `The selected file must be smaller than ${maxSizeInMB}MB.` },
      };
    }

    return null;
  };
}
