import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { Component, computed, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent, AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { AdminSearchFormErrorMessages } from '@constants/admin-search-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { defaultFormValues } from '@services/admin-search/admin-search.service';
import { CourthouseFormService } from '@services/courthouse-forms/courthouse-form.service';
import { FormService } from '@services/form/form.service';
import { isDateSpanMoreThanOneYear } from '@utils/date-range.utils';
import { dateRangeValidator } from '@validators/date-range.validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
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
export class SearchFormComponent implements OnInit {
  formValues = model<AdminSearchFormValues>(defaultFormValues);
  courthouses = input<Courthouse[]>([]);
  formState = output<AdminSearchFormValues>();
  searchOutput = output<AdminSearchFormValues>();
  errors = output<ErrorSummaryEntry[]>();
  courthouseFormService = inject(CourthouseFormService);

  logicError = output<{ code: string | null; tabName: string }>();
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

  ngOnInit() {
    this.form.patchValue(this.formValues());
  }

  courthouseAutoCompleteItems = computed(() =>
    this.courthouses()
      .map((c) => ({ id: c.id, name: c.displayName }))
      .filter((c) => !this.formValues()?.courthouses?.some((sc) => sc.id === c.id))
  );

  updateSelectedCourthouses(selectedCourthouse: AutoCompleteItem | null) {
    this.courthouseFormService.updateSelectedCourthouse(
      selectedCourthouse,
      this.courthouses(),
      this.form,
      this.formValues
    );
  }

  removeSelectedCourthouse(courthouseId: number) {
    this.courthouseFormService.removeSelectedCourthouse(courthouseId, this.form, this.formValues);
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
    this.formState.emit(this.form.value as AdminSearchFormValues);

    if (this.isInvalidDate()) {
      this.logicError.emit({ code: 'COMMON_105', tabName: this.form.get('resultsFor')?.value || 'Cases' });
      return;
    }

    if (!this.form.valid) {
      const errors = this.formService.getErrorSummaryRecursively(this.form, AdminSearchFormErrorMessages);
      this.errors.emit(errors);
      return;
    }

    this.errors.emit([]);

    this.searchOutput.emit(this.form.value as AdminSearchFormValues);
  }

  onClear() {
    this.errors.emit([]);
    this.clear.emit();
    this.form.reset(defaultFormValues);
  }

  isInvalidDate(): boolean {
    const hearingDate = this.form.get('hearingDate');
    const from = hearingDate?.get('from')?.value;
    const to = hearingDate?.get('to')?.value;

    if (isDateSpanMoreThanOneYear(from, to)) {
      return true;
    }

    return false;
  }
}
