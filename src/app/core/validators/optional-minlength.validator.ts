import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

// For optional fields, we need to check if the value is present before applying the minLength validator
export function optionalMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      return Validators.minLength(minLength)(control);
    }
    return null;
  };
}
