import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ErrorSummaryEntry, FieldErrors, SearchFormValues } from '@darts-types/index';
import { initAll } from '@scottish-government/pattern-library/src/all';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { futureDateValidator } from '@validators/future-date.validator';
import { Subscription, catchError, ignoreElements, of } from 'rxjs';
import { ResultsComponent } from './results/results.component';
import { SearchErrorComponent } from './search-error/search-error.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';

const fieldErrors: FieldErrors = {
  courthouse: {
    required: 'You must also enter a courthouse',
  },
  specific_date: {
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. The hearing date must be in the past',
  },
  date_from: {
    required: 'You have not selected a start date. Select a start date to define your search',
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. The hearing date must be in the past',
  },
  date_to: {
    required: 'You have not selected an end date. Select an end date to define your search',
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. The hearing date must be in the past',
  },
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResultsComponent,
    CourthouseComponent,
    SearchErrorComponent,
    LoadingComponent,
    ValidationErrorSummaryComponent,
  ],
})
export class SearchComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(CourthouseComponent) courthouseComponent!: CourthouseComponent;

  dateInputType: 'specific' | 'range' | undefined;
  isSubmitted = false;
  errorSummary: ErrorSummaryEntry[] = [];
  isAdvancedSearch = false;
  datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);
  dateValidators = [this.datePatternValidator, futureDateValidator];
  courthouses$ = this.caseService.getCourthouses();
  courthouse = '';

  // Retrieve Previous Search Results
  searchResults$ = this.caseService.searchResults$;
  searchError$ = this.errorMsgService.errorMessage$;
  subs: Subscription[] = [];

  constructor(
    private caseService: CaseService,
    private errorMsgService: ErrorMessageService
  ) {}

  form: FormGroup = new FormGroup({
    case_number: new FormControl(),
    courthouse: new FormControl(),
    courtroom: new FormControl(),
    judge_name: new FormControl(),
    defendant_name: new FormControl(),
    event_text_contains: new FormControl(),
    specific_date: new FormControl(),
    date_from: new FormControl(),
    date_to: new FormControl(),
  });

  ngOnInit() {
    // Set validation based on values entered in the form
    // [DMP-691] AC 2 - Listening for when courtroom has value, if so, then courthouse is required
    this.subs.push(
      this.form.controls.courtroom.valueChanges.subscribe((courtroom) => this.setCourthouseValidators(courtroom))
    );

    // Listen to form value changes, if the form is invalid and submitted, generate error summary
    this.subs.push(
      this.form.valueChanges.subscribe(() => {
        if (this.form.invalid && this.isSubmitted) {
          this.errorSummary = this.generateErrorSummary();
        } else {
          this.errorSummary = [];
        }
      })
    );

    // [DMP-691] AC3 & AC6 - Add date validators if specific_date field has value
    // Validators: required, future & pattern
    this.setSpecificDateValidators();

    // [DMP-691] AC3, AC4, AC5, AC6 - Add date range validators if either date_from or date_to field has a value.
    // Validators: required, future & pattern
    this.setDateRangeValidators();

    this.restoreForm();
  }

  toggleAdvancedSearch(event: Event) {
    event.preventDefault();
    this.isAdvancedSearch = !this.isAdvancedSearch;
  }

  setInputValue(value: string, control: string) {
    this.form.controls[`${control}`].patchValue(value);
  }

  isControlInvalid(control: keyof SearchFormValues): boolean {
    return this.isSubmitted && !!this.f[control].errors;
  }

  onSubmit() {
    this.isSubmitted = true;
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.isAdvancedSearch = true;
      return;
    }

    // Prevent service call being spammed with no form values
    if (!this.form.dirty && !this.form.touched) {
      //Manually set ErrorMessage for this case
      this.errorMsgService.setErrorMessage({ type: 'CASE_101', status: 204, display: 'COMPONENT' });
      return;
    }

    this.searchResults$ = this.caseService.searchCases(this.form.value);
    this.searchError$ = this.searchResults$.pipe(
      ignoreElements(),
      catchError(() => {
        // clear search form and results or error state will be cached in service
        this.caseService.searchFormValues = null;
        this.caseService.searchResults$ = null;
        this.errorMsgService.updateDisplayType('COMPONENT');
        return this.errorMsgService.errorMessage$;
      })
    );
  }

  toggleRadioSelected(type: 'specific' | 'range') {
    this.form.get('specific_date')?.reset();
    this.form.get('date_from')?.reset();
    this.form.get('date_to')?.reset();
    this.dateInputType = type;
  }

  onCourthouseSelected(courthouse: string) {
    this.form.get('courthouse')?.setValue(courthouse);
    this.form.get('courthouse')?.markAsDirty();
  }

  ngAfterViewChecked(): void {
    initAll();
  }

  get f() {
    return this.form.controls;
  }

  getFieldErrorMessages(fieldName: string): string[] {
    const errors = this.f[fieldName].errors;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map((errorType) => fieldErrors[fieldName][errorType]);
  }

  generateErrorSummary(): ErrorSummaryEntry[] {
    const formControls = this.f;
    return Object.keys(formControls)
      .filter((fieldId) => formControls[fieldId].errors)
      .map((fieldId) => this.getFieldErrorMessages(fieldId).map((message) => ({ fieldId, message })))
      .flat();
  }

  clearSearch() {
    this.form.reset();
    this.searchResults$ = null;
    this.caseService.searchResults$ = null;
    this.caseService.searchFormValues = null;
    this.searchError$ = of(null);
    this.isSubmitted = false;
    this.errorSummary = [];
    this.courthouseComponent.reset();
    this.dateInputType = undefined;
  }

  private setSpecificDateValidators() {
    const specificDateControl = this.form.controls.specific_date;
    specificDateControl.valueChanges.subscribe((value) => {
      if (value) {
        specificDateControl.setValidators(this.dateValidators);
      } else {
        specificDateControl.clearValidators();
      }
      specificDateControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }

  private setDateRangeValidators() {
    const dateFromControl = this.form.controls.date_from;
    const dateToControl = this.form.controls.date_to;

    // If date_from has value then date_to is required
    this.subs.push(
      dateFromControl.valueChanges.subscribe((dateFromValue) => {
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
      })
    );

    // If date_to has value then date_from is required
    this.subs.push(
      dateToControl.valueChanges.subscribe((value) => {
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
      })
    );
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

  restoreForm() {
    const previousFormValues = this.caseService.searchFormValues;

    if (previousFormValues) {
      // If we have any values for advanced search fields, open advanced search form
      this.isAdvancedSearch = Object.entries(previousFormValues).some(([key, value]) => {
        if (key === 'case_number') return false; // skip case_number
        return value;
      });

      if (previousFormValues?.specific_date) {
        this.dateInputType = 'specific';
      }

      if (previousFormValues?.date_from && previousFormValues?.date_to) {
        this.dateInputType = 'range';
      }

      if (previousFormValues.courthouse) this.courthouse = previousFormValues.courthouse;

      this.form.patchValue(previousFormValues);

      this.form.markAsDirty();
      this.isSubmitted = true;
    }
  }
  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
