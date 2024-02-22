import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorSummaryEntry, FieldErrors } from '@core-types/index';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  getFormControlErrorMessages(form: FormGroup, controlName: string, controlErrors: FieldErrors): string[] {
    const errors = form.get(controlName)?.errors;
    if (!errors || form.get(controlName)?.untouched) {
      return [];
    }
    return Object.keys(errors).map((error) => controlErrors[controlName][error]);
  }

  getErrorSummary(form: FormGroup, controlErrors: FieldErrors): ErrorSummaryEntry[] {
    const formControls = form.controls;
    return Object.keys(formControls)
      .filter((controlName) => formControls[controlName].errors)
      .map((controlName) =>
        this.getFormControlErrorMessages(form, controlName, controlErrors).map((message) => ({
          fieldId: controlName,
          message,
        }))
      )
      .flat();
  }
}
