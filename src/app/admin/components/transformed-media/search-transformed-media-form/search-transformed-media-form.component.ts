import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { TransformedMediaSearchFormErrorMessages } from '@constants/transformed-media-search-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { defaultFormValues } from '@services/transformed-media/transformed-media.service';
import { dateRangeValidator } from '@validators/date-range.validator';
import { futureDateValidator } from '@validators/future-date.validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
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
  @ViewChild(CourthouseComponent) courthouseComponent!: CourthouseComponent;

  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  formService = inject(FormService);
  formValues = input<TransformedMediaSearchFormValues>({ ...defaultFormValues });

  @Input() courthouses: Courthouse[] = [];

  form = this.fb.group({
    requestId: ['', [Validators.pattern(/^-?[0-9]*$/), Validators.min(1), Validators.max(2147483647)]],
    caseId: ['', [optionalMaxLengthValidator(32)]],
    courthouse: [''],
    hearingDate: ['', transformedMediaSearchDateValidators],
    owner: ['', [optionalMaxLengthValidator(2000)]],
    requestedBy: ['', [optionalMaxLengthValidator(2000)]],
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

  courthouse = signal('');

  constructor() {
    effect(() => this.restoreFormValues());
  }

  restoreFormValues() {
    const formValues = this.formValues();
    if (formValues.courthouse) {
      this.courthouse.set(formValues.courthouse!);
    }
    this.form.patchValue(this.formValues());
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
    this.courthouseComponent.reset();
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
