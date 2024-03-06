import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { Observable, map, of, switchMap, timer } from 'rxjs';

export const courthouseNameExistsValidator = (): AsyncValidatorFn => {
  const courthouseService = inject(CourthouseService);
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null);
        }

        return courthouseService.doesCourthouseNameExist(control.value).pipe(
          map((response) => {
            return response ? { courthouseNameExists: true } : null;
          })
        );
      })
    );
  };
};

export const displayNameExistsValidator = (): AsyncValidatorFn => {
  const courthouseService = inject(CourthouseService);
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null);
        }

        return courthouseService.doesDisplayNameExist(control.value).pipe(
          map((response) => {
            return response ? { displayNameExists: true } : null;
          })
        );
      })
    );
  };
};

export const valueIsUndefined = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // If it's undefined, that's OK
    // Also pass if there actually is a value too
    if (typeof value === 'undefined' || value) {
      return null;
    }
    return { required: true };
  };
};
