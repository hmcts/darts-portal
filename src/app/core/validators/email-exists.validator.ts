import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { UserAdminService } from '@services/user-admin.service';
import { Observable, map, of, switchMap, timer } from 'rxjs';

export const emailExistsValidator = (): AsyncValidatorFn => {
  const userAdminService = inject(UserAdminService);
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null);
        }

        return userAdminService.doesEmailExist(control.value).pipe(
          map((response) => {
            return response ? { emailExists: true } : null;
          })
        );
      })
    );
  };
};
