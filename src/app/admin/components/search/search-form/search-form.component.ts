import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent, AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { AdminSearchFormErrorMessages } from '@constants/admin-search-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { defaultFormValues } from '@services/admin-search/admin-search.service';
import { FormService } from '@services/form/form.service';
import { dateRangeValidator } from '@validators/date-range.validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
import { DateTime } from 'luxon';
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

type AdminSearchFormControl = keyof typeof AdminSearchFormErrorMessages;
@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [AutoCompleteComponent, SpecificOrRangeDatePickerComponent, ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  formValues = model<AdminSearchFormValues>(defaultFormValues);
  courthouses = input<Courthouse[]>([]);
  search = output<AdminSearchFormValues>();
  errors = output<ErrorSummaryEntry[]>();
  logicError = output<string | null>();
  clear = output<void>();
  formService = inject(FormService);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    courthouses: new FormControl<Courthouse[]>([]),
    caseId: [''],
    courtroom: ['', optionalMaxLengthValidator(64)],
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
    if (!courthouse) return;

    const updatedCourthouses = [...(this.form.value.courthouses ?? []), courthouse];

    this.form.patchValue({ courthouses: updatedCourthouses });
    this.form.get('courthouses')?.markAsDirty();

    this.formValues.update(() => ({
      ...(this.form.value as AdminSearchFormValues),
      courthouses: updatedCourthouses,
    }));
  }

  removeSelectedCourthouse(courthouseId: number) {
    this.formValues.update((values) => ({
      ...values,
      courthouses: values.courthouses.filter((c) => c.id !== courthouseId),
    }));
  }

  getFormControlErrorMessages(controlName: AdminSearchFormControl): string[] {
    const errors = this.form.get(controlName)?.errors;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map(
      (error) =>
        AdminSearchFormErrorMessages[controlName][
          error as keyof (typeof AdminSearchFormErrorMessages)[typeof controlName]
        ]
    );
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.isDateSpanMoreThanOneYear()) {
      this.logicError.emit('COMMON_105');
      return;
    }

    if (!this.form.valid) {
      const errors = this.formService.getErrorSummaryRecursively(this.form, AdminSearchFormErrorMessages);
      this.errors.emit(errors);
      return;
    }

    this.errors.emit([]);

    this.search.emit(this.form.value as AdminSearchFormValues);
  }

  onClear() {
    this.errors.emit([]);
    this.clear.emit();
  }

  isDateSpanMoreThanOneYear(): boolean {
    const hearingDate = this.form.get('hearingDate');
    const from = hearingDate?.get('from')?.value;
    const to = hearingDate?.get('to')?.value;

    if (!from || !to) return false;

    const fromDate = DateTime.fromFormat(from, 'dd/MM/yyyy');
    const toDate = DateTime.fromFormat(to, 'dd/MM/yyyy');

    if (!fromDate.isValid || !toDate.isValid) return false;

    return toDate.diff(fromDate, 'days').days > 365;
  }
}
