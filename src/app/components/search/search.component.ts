import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { initAll } from '@scottish-government/pattern-library/src/all';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseService } from '../../services/case/case.service';
import { CaseData } from '../../../app/types/case';
import { ResultsComponent } from './results/results.component';
import { CourthouseData } from '../../../app/types/courthouse';
import accessibleAutocomplete, { AccessibleAutocompleteProps } from 'accessible-autocomplete';
import { ERROR_MESSAGES } from './enums/error.enum';
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
    required: 'You must enter a courthouse.',
  },
  courtroom: {
    required: 'You must enter a courtroom.', //example
  }
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ResultsComponent, NgClass, NgFor],
})
export class SearchComponent implements AfterViewChecked, AfterViewInit {
  @ViewChild('courthouseAutocomplete', { static: false }) autocomplete!: ElementRef<HTMLElement>;
  dateInputType!: 'specific' | 'range';
  cases: CaseData[] = [];
  courthouses: CourthouseData[] = [];
  loaded = false;
  submitted = false;
  errorSummary: ErrorSummaryEntry[] = [];
  errorType = '';
  error = '';

  constructor(private caseService: CaseService) {}

  form: FormGroup = new FormGroup({
    case_number: new FormControl('', Validators.required),
    courtroom: new FormControl(),
    judge_name: new FormControl(),
    defendant_name: new FormControl(),
    event_text_contains: new FormControl(),
    date_from: new FormControl(),
    date_to: new FormControl(),
  });

  props: AccessibleAutocompleteProps = {
    id: 'advanced-case-search',
    source: [],
    minLength: 1,
    name: 'courthouse',
  };

  setInputValue(value: string, control: string) {
    this.form.controls[`${control}`].patchValue(value);
  }

  getCourthouses() {
    this.caseService.getCourthouses().subscribe(
      (result: CourthouseData[]) => {
        if (result) {
          this.courthouses = result;
          //Populate autocomplete once returned
          this.assignAutocompleteProps();
          accessibleAutocomplete(this.props);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.error) {
          this.errorType = error.error.type;
          this.loaded = true;
        }
      }
    );
  }

  assignAutocompleteProps() {
    //Assign element and courthouses from API
    this.props.element = this.autocomplete.nativeElement as HTMLElement;
    this.props.source = this.returnCourthouseNames(this.courthouses);
  }

  ngAfterViewInit() {
    this.getCourthouses();
  }

  returnCourthouseNames(courthouses: CourthouseData[]) {
    return courthouses.map(function (court) {
      return court.courthouse_name;
    });
  }

  // Submit Registration Form
  onSubmit() {
    this.submitted = true;
    this.errorSummary = [];
    if (this.form.invalid) {
      this.errorSummary = this.generateErrorSummary();
      return;
    }

    // let valid = true;

    // //AC2 - Searching a courtroom without courthouse
    //  if (this.form.get('courtroom')?.value !== '') {
    //   this.error = ERROR_MESSAGES.COURTROOM;
    //   this.errorType = 'COURTROOM';
    //   console.log(ERROR_MESSAGES.COURTROOM);
    //   valid = false;
    // }

    // if (this.form.get('courthouse')?.value === undefined) {
    //   const temp = this.form.get('courthouse')?.value;
    //   console.log('courthouse is ' + temp)
    //   valid = false;
    // }

    // const selectedDateInput = this.dateInputType.valueOf();

    // //AC4 - Date range: start date is blank (same as AC5)
    // if (selectedDateInput === 'range') {
    //   if (this.form.get('date_from')?.value === '' || this.form.get('date_to')?.value !== '') {
    //     this.errorType = 'START_DATE_MISSING';
    //     this.error = ERROR_MESSAGES.START_DATE_MISSING;
    //     console.log(ERROR_MESSAGES.START_DATE_MISSING);
    //     valid = false;
    //   }
    // }

    //AC5 - Date range: end date is blank
    // if (selectedDateInput === 'range') {
    //   if (this.form.get('date_from')?.value !== '' || this.form.get('date_to')?.value === '') {
    //     console.log(ERROR_MESSAGES.END_DATE_MISSING);
    //     this.errorType = 'END_DATE_MISSING';
    //     this.error = ERROR_MESSAGES.END_DATE_MISSING;
    //     valid = false;
    //   }
    // }

    //If manual input, verify format, i.e. expects 08/08/2023
    //AC6 - Invalid Date Format
    // if (this.form.get('specific')?.value !== Date) {
    //   this.errorType = 'INVALID_DATE';
    //   this.error = ERROR_MESSAGES.INVALID_DATE;
    //   console.log(ERROR_MESSAGES.INVALID_DATE);
    //   valid = false;
    // }

    //AC3 - Entering a date that's in the future

    // if (selectedDateInput === 'specific') {
    //     const DATE_FROM = new Date(this.form.get('date_from')?.value).toLocaleString('en-GB');
    //   console.log(DATE_FROM);
    //   const DATE_TODAY = new Date().toLocaleString('en-GB');
    //   console.log(DATE_TODAY);
    //   if (DATE_FROM > DATE_TODAY) {
    //     console.log(ERROR_MESSAGES.FUTURE_DATE)
    //     this.errorType = 'FUTURE_DATE';
    //     this.error = ERROR_MESSAGES.FUTURE_DATE;
    //     } else {
    //     valid = false;
    //     return;
    //   }
    // }
    //
    // const DATE_FROM = new Date(this.form.get('date_from')?.value).toLocaleString('en-GB');
    // function isDateInFuture(DATE_FROM: string): boolean {
    //   const inputDate = new Date(DATE_FROM).toLocaleString('en-GB');
    //   const currentDate = new Date().toLocaleString('en-GB');
    //   return inputDate > currentDate;
    // }

    // isDateInFuture(DATE_FROM);

    //AC3 - Entering a date that's in the future
    // const TEST_DATE1 = new Date('02/09/2023').toLocaleString('en-GB');
    // const TEST_DATE2 = new Date('02/11/2023').toLocaleString('en-GB');
    // if (TEST_DATE1 > TEST_DATE2) {
    //   console.log('Test date 1 is later in the year than test date 2');
    //   } else {
    //   console.log('Test date 2 is later in the year than test date 1')
    // }

    //const DATE_FROM_AGAIN = new Date(this.form.get('date_from')?.value);

    // if(!valid) {
    //   return;
    // }

    this.caseService
      .getCasesAdvanced(
        this.form.get('case_number')?.value || '',
        (document.querySelector('input[name=courthouse]') as HTMLInputElement).value || '',
        this.form.get('courtroom')?.value || '',
        this.form.get('judge_name')?.value || '',
        this.form.get('defendant_name')?.value || '',
        this.form.get('date_from')?.value || '',
        this.form.get('date_to')?.value || '',
        this.form.get('event_text_contains')?.value || ''
      )
      .subscribe(
        (result: CaseData[]) => {
          if (result) {
            this.cases = result;
            this.loaded = true;
            this.errorType = 'ok';
          }
        },
        (error: HttpErrorResponse) => {
          if (error.error) {
            this.errorType = error.error.type;
            this.loaded = true;
          }
        }
      );
  }

  toggleRadioSelected(type: 'specific' | 'range') {
    this.form.controls['date_from'].reset();
    this.form.controls['date_to'].reset();
    this.dateInputType = type;
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

    //Need custom block for non-formcontrol Courtrooms element
  }

  clearSearch() {
    (document.querySelector("[name='courthouse']") as HTMLInputElement).value = '';
    this.form.reset();
    this.cases = [];
    this.loaded = false;
    this.submitted = false;
    this.errorSummary = [];
  }

  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;
}
