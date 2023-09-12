import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NgClass, NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseService } from '../../services/case/case.service';
import { CaseData } from '../../../app/types/case';
import { ResultsComponent } from './results/results.component';
import { ERROR_MESSAGES } from './enums/error.enum';
import { CourthouseComponent } from '../common/courthouse/courthouse.component';
import { initAll } from '@scottish-government/pattern-library/src/all';
//import { moment }  from 'moment';

interface ErrorSummaryEntry {
  fieldId: string;
  message: string;
}

const FieldErrors: { [key: string]: { [key: string]: string } } = {
  case_number: {
    required: 'You must enter a case number.',
  },
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
export class SearchComponent implements OnInit {
  dateInputType!: 'specific' | 'range';
  cases: CaseData[] = [];
  loaded = false;
  isSubmitted = false;
  errorSummary: ErrorSummaryEntry[] = [];
  errorType = '';
  error = '';
  isAdvancedSearch = false;
  datePatternValidator = Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/);
  dateValidators = [Validators.required, this.datePatternValidator, this.futureDateValidator];
  courthouses$ = this.caseService.getCourthouses();

  constructor(private caseService: CaseService) {}

  form: FormGroup = new FormGroup({
    case_number: new FormControl('', Validators.required),
    courthouse: new FormControl(),
    courtroom: new FormControl(),
    judge_name: new FormControl(),
    defendant_name: new FormControl(),
    event_text_contains: new FormControl(),
    date_from: new FormControl(),
    date_to: new FormControl(),
  });

  ngOnInit() {
    this.form.get('courtroom')?.valueChanges.subscribe((courtroom) => {
      if (courtroom) {
        this.form.get('courthouse')?.setValidators([Validators.required]);
      } else {
        this.form.get('courthouse')?.clearValidators();
      }
      this.form.get('courthouse')?.updateValueAndValidity();
    });
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearch = !this.isAdvancedSearch;

    if (this.isAdvancedSearch) {
      this.form.get('case_number')?.clearValidators();
    } else {
      this.form.get('case_number')?.setValidators([Validators.required]);
    }
    this.form.get('case_number')?.updateValueAndValidity();
  }

  setInputValue(value: string, control: string) {
    this.form.controls[`${control}`].patchValue(value);
    //If specific type, set date_to to same value as date_from
    this.dateInputType === 'specific' && control == 'date_from' && this.form.controls[`date_to`].patchValue(value);
  }

  // Submit Registration Form
  onSubmit() {
    this.isSubmitted = true;
    this.errorSummary = [];
    if (this.form.invalid) {
      this.errorSummary = this.generateErrorSummary();
      return;
    }

    this.caseService
      .getCasesAdvanced(
        this.form.get('case_number')?.value || '',
        this.form.get('courthouse')?.value || '',
        this.form.get('courtroom')?.value || '',
        this.form.get('judge_name')?.value || '',
        this.form.get('defendant_name')?.value || '',
        this.form.get('date_from')?.value || '',
        this.form.get('date_to')?.value || '',
        this.form.get('event_text_contains')?.value || ''
      )
      .subscribe({
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

    this.form.get('date_from')?.setValidators(this.dateValidators);
    if (type === 'range') {
      this.form.get('date_to')?.setValidators(this.dateValidators);
    } else {
      this.form.get('date_to')?.clearValidators();
    }
    this.form.get('date_from')?.updateValueAndValidity();
    this.form.get('date_to')?.updateValueAndValidity();

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
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const dateValue = control.value;

    if (!dateValue) {
      return null; // Don't perform validation if the field is empty
    }

    // Split the input date string into day, month, and year components
    const dateParts = dateValue.split('/');
    if (dateParts.length !== 3) {
      return { invalidDate: true };
    }

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    // Create a Date object using the parsed components
    const inputDate = new Date(year, month - 1, day); // Subtract 1 from month since months are zero-based

    const currentDate = new Date();

    if (inputDate > currentDate) {
      return { futureDate: true };
    }
    return null;
  }

  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;
}
