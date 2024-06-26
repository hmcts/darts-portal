import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent, AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { AdminSearchFormErrorMessages } from '@constants/admin-search-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
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
  courthouses = input<Courthouse[]>([]);
  resultsFor = model('Cases');
  selectedCourthouses = signal<Courthouse[]>([]);
  search = output<AdminSearchFormValues>();
  errors = output<ErrorSummaryEntry[]>();
  formService = inject(FormService);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
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
    resultsFor: [this.resultsFor()],
  });

  constructor() {
    effect(() => this.form.controls.resultsFor.setValue(this.resultsFor()));
  }

  courthouseAutoCompleteItems = computed(() =>
    this.courthouses()
      .map((c) => ({ id: c.id, name: c.displayName }))
      .filter((c) => !this.selectedCourthouses().some((sc) => sc.id === c.id))
  );

  updateSelectedCourthouses(selectedCourthouse: AutoCompleteItem | null) {
    if (!selectedCourthouse) return;

    const courthouse = this.courthouses().find((c) => c.id === selectedCourthouse.id);
    const isAlreadySelected = this.selectedCourthouses().some((c) => c.id === selectedCourthouse?.id);

    if (courthouse && !isAlreadySelected) {
      this.selectedCourthouses.update((courthouses) => [...courthouses, courthouse]);
    }
  }

  removeSelectedCourthouse(courthouseId: number) {
    this.selectedCourthouses.update((courthouses) => courthouses.filter((c) => c.id !== courthouseId));
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      const errors = this.formService.getErrorSummaryRecursively(this.form, AdminSearchFormErrorMessages);
      this.errors.emit(errors);
      return;
    }

    this.errors.emit([]);

    this.search.emit({
      caseId: this.form.controls.caseId.value,
      courtroom: this.form.controls.courtroom.value,
      hearingDate: {
        type: this.form.controls.hearingDate.controls.type.value,
        specific: this.form.controls.hearingDate.controls.specific.value,
        from: this.form.controls.hearingDate.controls.from.value,
        to: this.form.controls.hearingDate.controls.to.value,
      },
      resultsFor: this.form.controls.resultsFor.value,
      courthouses: this.selectedCourthouses(),
    });
  }
}
