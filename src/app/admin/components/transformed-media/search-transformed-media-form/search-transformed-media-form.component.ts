import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { TransformedMediaSearchFormErrorMessages } from '@constants/transformed-media-search-form-error-messages';
import { CourthouseData, ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { defaultFormValues } from '@services/transformed-media/transformed-media.service';
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
  templateUrl: './search-transformed-media-form.component.html',
  styleUrl: './search-transformed-media-form.component.scss',
  imports: [
    ReactiveFormsModule,
    SpecificOrRangeDatePickerComponent,
    DatepickerComponent,
    CourthouseComponent,
    CommonModule,
  ],
})
export class SearchTransformedMediaFormComponent {
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  formService = inject(FormService);
  formValues = input<TransformedMediaSearchFormValues>({ ...defaultFormValues });

  @Input() courthouses: CourthouseData[] = [];

  form = this.fb.group({
    requestId: ['', Validators.pattern(/^[0-9]*$/)],
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

  constructor() {
    effect(() => this.form.patchValue(this.formValues()!));
  }

  @Output() search = new EventEmitter<typeof this.form.value>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();
  clear = output();

  isAdvancedSearch = model(false);

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errors.emit(this.formService.getErrorSummaryRecursively(this.form, TransformedMediaSearchFormErrorMessages));
      return;
    }

    this.errors.emit([]);
    this.search.emit(this.form.value);
  }

  onClear() {
    this.clear.emit();
  }

  getFormControlErrorMessages(controlName: string): string[] {
    return this.formService.getFormControlErrorMessages(
      this.form,
      controlName,
      TransformedMediaSearchFormErrorMessages
    );
  }

  getControlErrorMessage(controlPath: string[]): string[] {
    return this.formService.getControlErrorMessageWithControlPath(
      this.form,
      TransformedMediaSearchFormErrorMessages,
      controlPath
    );
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearch.set(!this.isAdvancedSearch());
  }

  setInputValue(value: string, control: string) {
    this.form.get(control)?.setValue(value);
    this.form.get(control)?.markAsTouched();
  }
}
