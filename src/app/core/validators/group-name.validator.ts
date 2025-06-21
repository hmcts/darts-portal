import { SecurityGroup } from '@admin-types/index';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const groupNameExistsValidator = (groups: SecurityGroup[], ownName: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (groups.length === 0 || control.value === null || control.value === '') {
      return null;
    }
    const trimmedLowerCaseValue = control.value.toString().trim().toLowerCase();
    // If the group does not exist or the group name is the same as the current group name, return null
    const foundGroup = groups.find(
      (group) =>
        group.name.toLowerCase() === trimmedLowerCaseValue || group.displayName.toLowerCase() === trimmedLowerCaseValue
    );
    if (!foundGroup || trimmedLowerCaseValue === ownName.toLowerCase()) {
      return null;
    }
    return { groupNameExists: true };
  };
};
