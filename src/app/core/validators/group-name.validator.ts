import { SecurityGroup } from '@admin-types/index';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const groupNameExistsValidator = (groups: SecurityGroup[], ownName: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // If the group does not exist or the group name is the same as the current group name, return null
    if (!groups?.find((group) => group.name === value || group.displayName === value) || value === ownName) {
      return null;
    }
    return { groupNameExists: true };
  };
};
