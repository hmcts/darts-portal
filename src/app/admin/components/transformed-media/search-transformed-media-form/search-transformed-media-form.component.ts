import { NgIf } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { TransformedMediaSearchFormErrorMessages } from '@constants/transformed-media-search-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { dateRangeValidator } from '@validators/date-range.validator';
import { futureDateValidator } from '@validators/future-date.validator';
import { realDateValidator } from '@validators/real-date.validator';

export const transformedMediaSearchDateValidators = [
  Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  futureDateValidator,
  realDateValidator,
];

@Component({
  selector: 'app-search-transformed-media-form',
  standalone: true,
  imports: [ReactiveFormsModule, SpecificOrRangeDatePickerComponent, DatepickerComponent, NgIf],
  templateUrl: './search-transformed-media-form.component.html',
  styleUrl: './search-transformed-media-form.component.scss',
})
export class SearchTransformedMediaFormComponent {
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);

  form = this.fb.group({
    requestId: [''],
    caseId: [''],
    courthouse: [''],
    hearingDate: ['', transformedMediaSearchDateValidators],
    owner: [''],
    requestedBy: [''],
    requestedDate: this.fb.group(
      {
        type: [''],
        specific: ['', transformedMediaSearchDateValidators],
        from: ['', transformedMediaSearchDateValidators],
        to: ['', transformedMediaSearchDateValidators],
      },
      { validators: [dateRangeValidator('from', 'to')] }
    ),
  });

  @Output() search = new EventEmitter<typeof this.form.value>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  isAdvancedSearch = false;

  toggleAdvancedSearch() {
    this.isAdvancedSearch = !this.isAdvancedSearch;
  }

  setInputValue(value: string, control: string) {
    this.form.get(control)?.setValue(value);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errors.emit(this.getErrorSummary(this.form));
      return;
    }

    this.search.emit(this.form.value);
  }

  getControlErrorMessage(controlPath: string[]): string[] {
    const control = this.form.get(controlPath);
    const errors = control?.errors;

    if (!errors || !control.touched) return [];

    const controlKey = controlPath[controlPath.length - 1];
    const errorKey = Object.keys(errors)[0];

    return [TransformedMediaSearchFormErrorMessages[controlKey][errorKey]];
  }

  getErrorSummary(form: FormGroup, controlPath: string[] = []): ErrorSummaryEntry[] {
    const formControls = form.controls;

    return Object.keys(formControls)
      .filter((controlName) => formControls[controlName].invalid)
      .map((controlName) => {
        const control = formControls[controlName];

        if (control instanceof FormGroup) {
          return this.getErrorSummary(control, [...controlPath, controlName]);
        }

        return {
          fieldId: controlName,
          message: this.getControlErrorMessage([...controlPath, controlName])[0],
        };
      })
      .flat();
  }
}
