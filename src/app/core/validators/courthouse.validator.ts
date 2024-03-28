import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CourthouseData } from '@core-types/index';

export const courthouseNameExistsValidator = (courthouses: CourthouseData[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // If the courthouse name does not exist in the courthouse array
    if (!courthouses?.find((courthouse) => courthouse.courthouse_name === value)) {
      return null;
    }
    return { courthouseNameExists: true };
  };
};

export const displayNameExistsValidator = (courthouses: CourthouseData[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // If the display name does not exist in the courthouse array
    if (!courthouses?.find((courthouse) => courthouse.display_name === value)) {
      return null;
    }
    return { displayNameExists: true };
  };
};

export const valueIsUndefined = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // If it's undefined or 0, that's OK
    // Also pass if there actually is a value too
    if (typeof value === 'undefined' || value === 0 || value) {
      return null;
    }
    return { required: true };
  };
};

export const valueIsNull = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // If it's null or 0, that's OK
    // Also pass if there actually is a value too
    if (value === null || value === 0 || value) {
      return null;
    }
    return { required: true };
  };
};
