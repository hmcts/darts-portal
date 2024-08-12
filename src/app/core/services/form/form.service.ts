import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorSummaryEntry, FormErrorMessages } from '@core-types/index';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  getFormControlErrorMessages(form: FormGroup, controlName: string, controlErrors: FormErrorMessages): string[] {
    const errors = form.get(controlName)?.errors;
    if (!errors || form.get(controlName)?.untouched) {
      return [];
    }
    return Object.keys(errors).map((error) => controlErrors[controlName][error]);
  }

  getErrorSummary(form: FormGroup, controlErrors: FormErrorMessages): ErrorSummaryEntry[] {
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

  getControlErrorMessageWithControlPath(
    form: FormGroup,
    errorMessages: Record<string, Record<string, string>>,
    controlPath: string[]
  ): string[] {
    const controlKey = controlPath[controlPath.length - 1];
    const control = form.get(controlKey);
    const errors = control?.errors;

    if (!errors || !control.touched) return [];
    const errorKey = Object.keys(errors)[0];
    return [errorMessages[controlKey][errorKey]];
  }

  getErrorSummaryRecursively(
    form: FormGroup,
    errorMessages: Record<string, Record<string, string>>,
    controlPath: string[] = []
  ): ErrorSummaryEntry[] {
    const formControls = form.controls;

    return Object.keys(formControls)
      .filter((controlName) => formControls[controlName].invalid)
      .map((controlName) => {
        const control = formControls[controlName];
        if (control instanceof FormGroup) {
          return this.getErrorSummaryRecursively(control, errorMessages, [...controlPath, controlName]);
        }
        return {
          fieldId: controlName,
          message: this.getControlErrorMessageWithControlPath(form, errorMessages, [...controlPath, controlName])[0],
        };
      })
      .flat();
  }

  getUniqueErrorSummary(form: FormGroup, controlErrors: FormErrorMessages): ErrorSummaryEntry[] {
    const formControls = form.controls;
    const encounteredMessages = new Set<string>();

    return Object.keys(formControls)
      .filter((controlName) => formControls[controlName].errors)
      .map((controlName) =>
        this.getFormControlErrorMessages(form, controlName, controlErrors).map((message) => ({
          fieldId: controlName,
          message,
        }))
      )
      .flat()
      .filter((entry) => {
        if (encounteredMessages.has(entry.message)) {
          return false;
        } else {
          encounteredMessages.add(entry.message);
          return true;
        }
      });
  }
}
