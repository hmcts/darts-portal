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

interface ErrorSummaryEntry {
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
  imports: [CommonModule, ReactiveFormsModule, NgIf, ResultsComponent, NgClass, NgFor, CourthouseComponent],
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
    date_from: new FormControl(),
    date_to: new FormControl(),
  });

  ngOnInit() {
    this.subs.push(
      this.form.controls.courtroom.valueChanges.subscribe((courtroom) => this.setCourtRoomValidators(courtroom))
    );

    this.subs.push(
      this.form.valueChanges.subscribe(() => {
        if (this.form.invalid && this.isSubmitted) {
          this.errorSummary = this.generateErrorSummary();
        } else {
          this.errorSummary = [];
        }
      })
    );

    // If date range, if date_from has value then date_to is required
    this.subs.push(
      this.form.controls.date_from.valueChanges.subscribe(() => {
        if (this.form.controls.date_from.value && this.dateInputType === 'range') {
          this.form.controls.date_to.setValidators([Validators.required, ...this.dateValidators]);
        } else {
          this.form.controls.date_to.setValidators(this.dateValidators);
        }
        this.form.controls.date_to.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      })
    );

    // If date range, if date_to has value then date_from is required
    this.subs.push(
      this.form.controls.date_to.valueChanges.subscribe(() => {
        if (this.form.controls.date_to.value && this.dateInputType === 'range') {
          this.form.controls.date_from.setValidators([Validators.required, ...this.dateValidators]);
        } else {
          this.form.controls.date_from.setValidators(this.dateValidators);
        }
        this.form.controls.date_from.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      })
    );
  }

  toggleAdvancedSearch(event: Event) {
    event.preventDefault();
    this.isAdvancedSearch = !this.isAdvancedSearch;
  }

  setInputValue(value: string, control: string) {
    this.form.controls[`${control}`].patchValue(value);
    //If specific type, set date_to to same value as date_from
    this.dateInputType === 'specific' && control == 'date_from' && this.form.controls[`date_to`].patchValue(value);
  }

  // Submit Registration Form
  onSubmit() {
    this.isSubmitted = true;
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.isAdvancedSearch = true;
      return;
    }

    // Prevent service call being spammed with no form values
    if (!this.form.dirty || !this.form.touched) {
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
    this.form.controls['date_from'].reset();
    this.form.controls['date_to'].reset();

    this.setDateValidators(type);

    this.dateInputType = type;
  }

  onCourthouseSelected(courthouse: string) {
    this.form.get('courthouse')?.setValue(courthouse);
  }

  ngAfterViewChecked(): void {
    initAll();
  }

  // convenience getter for easy access to form fields
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

  private generateErrorSummary(): ErrorSummaryEntry[] {
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
    this.setDateValidators(this.dateInputType);
  }

  private setDateValidators(type: string | undefined) {
    const dateFromFormControl = this.form.get('date_from');
    const dateToFormControl = this.form.get('date_to');

    if (type === undefined) {
      dateFromFormControl?.clearValidators();
      dateToFormControl?.clearValidators();
    } else {
      dateFromFormControl?.setValidators(this.dateValidators);
      if (type === 'range') {
        dateToFormControl?.setValidators(this.dateValidators);
      } else {
        dateToFormControl?.clearValidators();
      }
    }
    dateFromFormControl?.updateValueAndValidity();
    dateToFormControl?.updateValueAndValidity();
  }

  private setCourtRoomValidators(courtroom: string) {
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
