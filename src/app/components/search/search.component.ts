import { CourthouseComponent } from './../common/courthouse/courthouse.component';
import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { initAll } from '@scottish-government/pattern-library/src/all';
import { Subscription } from 'rxjs';
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
  dateValidators = [Validators.required, this.datePatternValidator, this.futureDateValidator];
  courthouses$ = this.caseService.getCourthouses();
  subs: Subscription[] = [];

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
    this.subs.push(
      this.form.controls.courtroom.valueChanges.subscribe((courtroom) => this.setCourtRoomValidators(courtroom))
    );
  }

  toggleAdvancedSearch(event: Event) {
    event.preventDefault();
    this.isAdvancedSearch = !this.isAdvancedSearch;
    this.setAdvancedSearchValidators(this.isAdvancedSearch);
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
      this.isAdvancedSearch = true;
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

  private setAdvancedSearchValidators(isAdvancedSearch: boolean) {
    const caseNumberFormControl = this.form.get('case_number');

    if (isAdvancedSearch) {
      caseNumberFormControl?.clearValidators();
    } else {
      caseNumberFormControl?.setValidators([Validators.required]);
    }
    caseNumberFormControl?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
