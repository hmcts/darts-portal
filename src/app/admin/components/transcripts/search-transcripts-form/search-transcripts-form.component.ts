import { TranscriptionSearchFormValues } from '@admin-types/index';
import { CommonModule, NgIf } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { TranscriptSearchFormErrorMessages } from '@constants/transcript-search-form-error-messages';
import { CourthouseData, ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { defaultFormValues } from '@services/transcription-admin/transcription-admin.service';
import { dateRangeValidator } from '@validators/date-range.validator';
import { futureDateValidator } from '@validators/future-date.validator';
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
    NgIf,
    SpecificOrRangeDatePickerComponent,
    CourthouseComponent,
    CommonModule,
  ],
})
export class SearchTranscriptsFormComponent {
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  formService = inject(FormService);

  isCompletedTranscriptSearch = input(false);
  courthouses = input<CourthouseData[]>([]);
  formValues = model<TranscriptionSearchFormValues>(defaultFormValues);

  form = this.fb.group({
    requestId: [''],
    caseId: [''],
    courthouse: [''],
    hearingDate: ['', transcriptSearchDateValidators],
    owner: [''],
    requestedBy: [''],
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

  constructor() {
    effect(() => this.form.patchValue(this.formValues()));
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
