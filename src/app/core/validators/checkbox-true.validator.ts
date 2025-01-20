import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mustBeTrueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === true ? null : { required: true };
  };
}
