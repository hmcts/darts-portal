import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const timeGroupValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const hours = control.get('hours');
  const minutes = control.get('minutes');
  const seconds = control.get('seconds');  

  return hours?.hasError('required') || minutes?.hasError('required') || seconds?.hasError('required') ? {required: true} : null;
}