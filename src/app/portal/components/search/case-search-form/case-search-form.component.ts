import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { CaseSearchFormErrorMessages } from '@constants/case-search-form-error-messages';
import { CourthouseData, ErrorSummaryEntry } from '@core-types/index';
import { NestedKeys } from '@core-types/utils/nested-keys.type';
import { CaseSearchForm, CaseSearchFormValues } from '@portal-types/index';
import { ErrorMessageService } from '@services/error/error-message.service';
import { FormService } from '@services/form/form.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { dateRangeValidator } from '@validators/date-range.validator';
import { futureDateValidator } from '@validators/future-date.validator';
import { transformedMediaSearchDateValidators } from 'src/app/admin/components/transformed-media/search-transformed-media-form/search-transformed-media-form.component';

@Component({
  selector: 'app-case-search-form',
  standalone: true,
  imports: [CourthouseComponent, NgClass, ReactiveFormsModule, NgFor, NgIf, SpecificOrRangeDatePickerComponent],
  templateUrl: './case-search-form.component.html',
  styleUrl: './case-search-form.component.scss',
})
export class CaseSearchFormComponent implements OnInit {
  @ViewChild(CourthouseComponent) courthouseComponent!: CourthouseComponent;

  fb = inject(NonNullableFormBuilder);
  scrollService = inject(ScrollService);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);
  errorMsgService = inject(ErrorMessageService);

  formValues = input<CaseSearchFormValues | null>(null);
  courthouses = input<CourthouseData[]>([]);

  isSubmitted = model(false);
  isAdvancedSearch = model(false);

  search = output<CaseSearchFormValues>();
  validationError = output<ErrorSummaryEntry[]>();
  error = output();
  clear = output();

  courthouse = signal('');

  datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);
  dateValidators = [this.datePatternValidator, futureDateValidator];

  CaseSearchFormErrorMessages = CaseSearchFormErrorMessages;

  form: CaseSearchForm = this.fb.group({
    caseNumber: [''],
    courthouse: [''],
    courtroom: [''],
    hearingDate: this.fb.group(
      {
        type: [''],
        specific: ['', transformedMediaSearchDateValidators],
        from: ['', transformedMediaSearchDateValidators],
        to: ['', transformedMediaSearchDateValidators],
      },
      { validators: [dateRangeValidator('from', 'to')] }
    ),
    judgeName: [''],
    defendantName: [''],
    eventTextContains: [''],
  });

  ngOnInit() {
    this.form.controls.courtroom.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((courtroom) => this.setCourthouseValidators(courtroom));

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.form.invalid && this.isSubmitted()) {
        this.validationError.emit(this.generateErrorSummary());
      } else {
        this.validationError.emit([]);
      }
    });

    this.setSpecificDateValidators();
    this.setDateRangeValidators();

    this.restoreForm();
  }

  onSubmit() {
    this.isSubmitted.set(true);
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.scrollService.scrollTo('app-validation-error-summary');
      this.isAdvancedSearch.set(true);
      return;
    }

    // Prevent service call being spammed with no form values
    if (!this.form.dirty) {
      //Manually set ErrorMessage for this case
      this.errorMsgService.setErrorMessage({ detail: { type: 'CASE_101' }, status: 204, display: 'COMPONENT' });
      return;
    }

    this.search.emit(this.form.value as CaseSearchFormValues);
  }

  toggleAdvancedSearch(event: Event) {
    event.preventDefault();
    this.isAdvancedSearch.set(!this.isAdvancedSearch());
  }

  isControlInvalid(control: NestedKeys<CaseSearchFormValues>): boolean {
    return Boolean(this.form.get(control)?.touched && this.form.get(control)?.errors);
  }

  get f() {
    return this.form.controls;
  }

  getFieldErrorMessages(controlKey: NestedKeys<CaseSearchFormValues>): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlKey, CaseSearchFormErrorMessages);
  }

  generateErrorSummary(): ErrorSummaryEntry[] {
    return this.formService.getErrorSummaryRecursively(this.form, CaseSearchFormErrorMessages);
  }

  onCourthouseSelected(courthouse: string) {
    this.form.get('courthouse')?.patchValue(courthouse);
    this.form.get('courthouse')?.markAsDirty();
  }

  restoreForm() {
    const formValues = this.formValues();
    if (formValues) {
      if (formValues.courthouse) this.courthouse.set(formValues.courthouse);
      this.form.patchValue(formValues);
      this.form.markAsDirty();
      this.form.markAllAsTouched();
      this.isSubmitted.set(false);
    }
  }

  clearSearch() {
    this.form.reset();
    this.courthouseComponent.reset();
    this.isSubmitted.set(false);
    this.isAdvancedSearch.set(false);
    this.clear.emit();
  }

  private setCourthouseValidators(courtroom: string) {
    const courtHouseFormControl = this.form.get('courthouse');
    if (courtroom) {
      courtHouseFormControl?.setValidators([Validators.required]);
    } else {
      courtHouseFormControl?.clearValidators();
    }
    courtHouseFormControl?.updateValueAndValidity();
  }

  private setSpecificDateValidators() {
    const specificDateControl = this.form.controls.hearingDate.controls.specific;
    specificDateControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        specificDateControl.setValidators(this.dateValidators);
      } else {
        specificDateControl.clearValidators();
      }
      specificDateControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }

  private setDateRangeValidators() {
    const dateFromControl = this.form.controls.hearingDate.controls.from;
    const dateToControl = this.form.controls.hearingDate.controls.to;

    // If date_from has value then date_to is required

    dateFromControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dateFromValue) => {
      if (dateFromValue) {
        dateToControl.setValidators([Validators.required, ...this.dateValidators]);
        dateFromControl.setValidators(this.dateValidators);
      } else {
        dateToControl.clearValidators();
      }

      if (dateToControl.value) {
        dateFromControl.setValidators([Validators.required, ...this.dateValidators]);
      }

      dateFromControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      dateToControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });

    // If date_to has value then date_from is required

    dateToControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        dateFromControl.setValidators([Validators.required, ...this.dateValidators]);
        dateToControl.setValidators(this.dateValidators);
      } else {
        dateFromControl.clearValidators();
      }

      if (dateFromControl.value) {
        dateToControl.setValidators([Validators.required, ...this.dateValidators]);
      }

      dateToControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      dateFromControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }
}
