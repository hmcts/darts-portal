import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { TranscriptSearchFormErrorMessages } from '@constants/transcript-search-form-error-messages';

@Component({
  selector: 'app-specific-or-range-date-picker',
  standalone: true,
  imports: [ReactiveFormsModule, DatepickerComponent, NgIf, NgClass, JsonPipe],
  templateUrl: './specific-or-range-date-picker.component.html',
  styleUrl: './specific-or-range-date-picker.component.scss',
})
export class SpecificOrRangeDatePickerComponent implements OnInit {
  controlContainer = inject(ControlContainer);
  destroyRef = inject(DestroyRef);
  @Input() label = '';

  form!: FormGroup<{
    type: FormControl<string | null>;
    specific: FormControl<string | null>;
    from: FormControl<string | null>;
    to: FormControl<string | null>;
  }>;

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
    this.resetDateControlsOnDateTypeChanges();
    this.setDateRangeErrorsOnChanges();
  }

  get dateTypeControl() {
    return this.form.controls.type;
  }

  get fromDateControl() {
    return this.form.controls.from;
  }

  get toDateControl() {
    return this.form.controls.to;
  }

  get specificDateControl() {
    return this.form.controls.specific;
  }

  setInputValue(value: string, control: string) {
    this.form.get(control)?.setValue(value);
  }

  getControlErrorMessage(controlPath: string[]): string[] {
    const control = this.form.get(controlPath);
    const errors = control?.errors;

    if (!errors || !control.touched) return [];

    const controlKey = controlPath[controlPath.length - 1];
    const errorKey = Object.keys(errors)[0];

    return [TranscriptSearchFormErrorMessages[controlKey][errorKey]];
  }

  private setDateRangeErrorsOnChanges() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.form.hasError('dateRange')) {
        this.fromDateControl.setErrors({ dateRange: true });
        this.fromDateControl?.markAsTouched();

        this.toDateControl.setErrors({ dateRange: true });
        this.toDateControl.markAsTouched();
      }
    });
  }

  private resetDateControlsOnDateTypeChanges() {
    this.dateTypeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.specificDateControl.setValue('');
      this.fromDateControl.setValue('');
      this.toDateControl.setValue('');
    });
  }
}
