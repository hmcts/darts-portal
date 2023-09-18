import { CourthouseComponent } from './../common/courthouse/courthouse.component';
import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseService } from '../../services/case/case.service';
import { CaseData } from '../../../app/types/case';
import { ResultsComponent } from './results/results.component';
import { initAll } from '@scottish-government/pattern-library/src/all';
import { Subscription } from 'rxjs';
import { futureDateValidator } from 'src/app/validators/future-date.validator';
import { SearchFormValues } from 'src/app/types/search-form.interface';

export interface ErrorSummaryEntry {
  fieldId: string;
  message: string;
}

const FieldErrors: { [key: string]: { [key: string]: string } } = {
  courthouse: {
    required: 'You must enter a courthouse, if courtroom is filled.',
  },
  courtroom: {
    required:
      'The courtroom number you have entered is not a recognised number for this courthouse. Check and try again',
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
  imports: [CommonModule, ReactiveFormsModule, ResultsComponent, CourthouseComponent],
})
export class SearchComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(CourthouseComponent) courthouseComponent!: CourthouseComponent;

  dateInputType: 'specific' | 'range' | undefined;
  cases: CaseData[] = [];
  loaded = false;
  isSubmitted = false;
  errorSummary: ErrorSummaryEntry[] = [];
  errorType = '';
  error = '';
  isAdvancedSearch = false;
  datePatternValidator = Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/);
  dateValidators = [this.datePatternValidator, futureDateValidator];
  courthouses$ = this.caseService.getCourthouses();
  subs: Subscription[] = [];

  constructor(private caseService: CaseService) {}

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
      this.errorType = 'CASE_101';
      return;
    }

    this.caseService.getCasesAdvanced(this.form.value).subscribe({
      next: (result: CaseData[]) => {
        if (result) {
          this.cases = result;
          this.loaded = true;
          this.errorType = 'ok';
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.errorType = error.error.type;
          this.loaded = true;
        }
      },
    });
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
    return Object.keys(errors).map((errorType) => FieldErrors[fieldName][errorType]);
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
    this.cases = [];
    this.loaded = false;
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

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
