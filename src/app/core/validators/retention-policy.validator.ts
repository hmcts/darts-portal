import { RetentionPolicy } from '@admin-types/index';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const uniqueValidator = (existingPolicies: RetentionPolicy[], key: keyof RetentionPolicy): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value.trim();

    if (!existingPolicies?.find((policy) => policy[key] == value)) {
      return null;
    }

    return { unique: true };
  };
};
