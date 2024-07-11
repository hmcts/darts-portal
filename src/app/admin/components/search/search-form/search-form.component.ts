import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent, AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { AdminSearchFormErrorMessages } from '@constants/admin-search-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { defaultFormValues } from '@services/admin-search/admin-search.service';
import { FormService } from '@services/form/form.service';
import { dateRangeValidator } from '@validators/date-range.validator';
import { transformedMediaSearchDateValidators } from '../../transformed-media/search-transformed-media-form/search-transformed-media-form.component';

export type AdminSearchFormValues = {
  courthouses: Courthouse[];
  caseId: string;
  courtroom: string;
  hearingDate: {
    type: string;
    specific: string;
    from: string;
    to: string;
  };
  resultsFor: string;
};
@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [AutoCompleteComponent, SpecificOrRangeDatePickerComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  formValues = model<AdminSearchFormValues>(defaultFormValues);
  courthouses = input<Courthouse[]>([]);
  search = output<AdminSearchFormValues>();
  errors = output<ErrorSummaryEntry[]>();
  clear = output<void>();
  formService = inject(FormService);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    courthouses: new FormControl<Courthouse[]>([]),
    caseId: [''],
    courtroom: [''],
    hearingDate: this.fb.nonNullable.group(
      {
        type: [''],
        specific: ['', transformedMediaSearchDateValidators],
        from: ['', transformedMediaSearchDateValidators],
        to: ['', transformedMediaSearchDateValidators],
      },
      { validators: [dateRangeValidator('from', 'to')] }
    ),
    resultsFor: [''],
  });

  constructor() {
    // if formValues are passed in update the form
    effect(() => this.form.patchValue(this.formValues()));
  }

  courthouseAutoCompleteItems = computed(() =>
    this.courthouses()
      .map((c) => ({ id: c.id, name: c.displayName }))
      .filter((c) => !this.formValues()?.courthouses?.some((sc) => sc.id === c.id))
  );

  updateSelectedCourthouses(selectedCourthouse: AutoCompleteItem | null) {
    if (!selectedCourthouse) return;

    const courthouse = this.courthouses().find((c) => c.id === selectedCourthouse.id);
    const isAlreadySelected = this.formValues().courthouses.some((c) => c.id === selectedCourthouse?.id);

    if (courthouse && !isAlreadySelected) {
      this.formValues.update((values) => ({ ...values, courthouses: [...values.courthouses, courthouse] }));
    }
  }

  removeSelectedCourthouse(courthouseId: number) {
    this.formValues.update((values) => ({
      ...values,
      courthouses: values.courthouses.filter((c) => c.id !== courthouseId),
    }));
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      const errors = this.formService.getErrorSummaryRecursively(this.form, AdminSearchFormErrorMessages);
      this.errors.emit(errors);
      return;
    }

    this.errors.emit([]);

    this.search.emit(this.form.value as AdminSearchFormValues);
  }
}
