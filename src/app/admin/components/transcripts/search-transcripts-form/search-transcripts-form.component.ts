import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { TranscriptionSearchFormValues } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { TranscriptSearchFormErrorMessages } from '@constants/transcript-search-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { defaultFormValues } from '@services/transcription-admin/transcription-admin.service';
import { dateRangeValidator } from '@validators/date-range.validator';
import { futureDateValidator } from '@validators/future-date.validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
import { realDateValidator } from '@validators/real-date.validator';

export const transcriptSearchDateValidators = [
  Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  futureDateValidator,
  realDateValidator,
];

@Component({
  selector: 'app-search-transcripts-form',
  standalone: true,
  templateUrl: './search-transcripts-form.component.html',
  styleUrl: './search-transcripts-form.component.scss',
  imports: [
    ReactiveFormsModule,
    DatepickerComponent,
    SpecificOrRangeDatePickerComponent,
    CourthouseComponent,
    CommonModule,
  ],
})
export class SearchTranscriptsFormComponent implements OnInit {
  @ViewChild(CourthouseComponent) courthouseComponent!: CourthouseComponent;

  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  formService = inject(FormService);

  isCompletedTranscriptSearch = input(false);
  courthouses = input<Courthouse[]>([]);
  formValues = model<TranscriptionSearchFormValues>(defaultFormValues);

  courthouse = signal('');

  form = this.fb.group({
    requestId: ['', [Validators.pattern(/^-?[0-9]*$/), Validators.min(1), Validators.max(2147483647)]],
    caseId: ['', [optionalMaxLengthValidator(32)]],
    courthouse: [''],
    hearingDate: ['', transcriptSearchDateValidators],
    requestedBy: ['', [optionalMaxLengthValidator(2000)]],
    requestedDate: this.fb.group(
      {
        type: [''],
        specific: ['', transcriptSearchDateValidators],
        from: ['', transcriptSearchDateValidators],
        to: ['', transcriptSearchDateValidators],
      },
      { validators: [dateRangeValidator('from', 'to')] }
    ),
    requestMethod: [''],
  });

  search = output<typeof this.form.value>();
  errors = output<ErrorSummaryEntry[]>();
  clear = output();

  isAdvancedSearch = model(false);

  ngOnInit() {
    this.restoreFormValues();
  }

  restoreFormValues() {
    const formValues = this.formValues();
    if (formValues.courthouse) {
      this.courthouse.set(formValues.courthouse!);
    }
    this.form.patchValue(this.formValues());
  }

  clearSearch() {
    this.clear.emit();
    this.courthouseComponent.reset();
    this.form.reset();
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearch.set(!this.isAdvancedSearch());
  }

  setInputValue(value: string, control: string) {
    this.form.get(control)?.setValue(value);
    this.form.get(control)?.markAsTouched();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errors.emit(this.formService.getErrorSummaryRecursively(this.form, TranscriptSearchFormErrorMessages));
      return;
    }

    this.errors.emit([]);
    this.search.emit(this.form.value);
  }

  getControlErrorMessage(controlPath: string[]): string[] {
    return this.formService.getControlErrorMessageWithControlPath(
      this.form,
      TranscriptSearchFormErrorMessages,
      controlPath
    );
  }
}
