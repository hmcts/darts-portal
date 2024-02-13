import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

// For optional fields, we need to check if the value is present before applying the maxLength validator
export function optionalMaxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      return Validators.maxLength(maxLength)(control);
    }
    return null;
  };
}
