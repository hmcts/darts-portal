import { AfterViewChecked, Component } from '@angular/core';
import { initAll } from '@scottish-government/pattern-library/src/all';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseService } from '../../services/case/case.service';
import { CaseData } from '../../../app/types/case';
import { ResultsComponent } from './results/results.component';
import { RouterLink } from '@angular/router';
import { ERROR_MESSAGES } from './enums/error.enum';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ResultsComponent, RouterLink],
})
export class SearchComponent implements AfterViewChecked {
  dateInputType!: 'specific' | 'range';
  cases: CaseData[] = [];
  loaded = false;
  errorType = '';
  hasErrors = false;

  constructor(private caseService: CaseService) {}

  form = new FormGroup({
    case_number: new FormControl('', Validators.required),
    courthouse: new FormControl(),
    courtroom: new FormControl(),
    judge_name: new FormControl(),
    defendant_name: new FormControl(),
    event_text_contains: new FormControl(),
    date_from: new FormControl(),
    date_to: new FormControl(),
  });

  // Submit Registration Form
  onSubmit() {
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

    //AC2 - Searching a courtroom without courthouse
    if (this.form.get('courtroom')?.value !== '' && this.form.get('courthouse')?.value === '') {
      this.hasErrors = true;
      console.log(ERROR_MESSAGES.COURTROOM);
    }

    //AC3 - Entering a date that's in the future
    const TODAY = new Date();
    // if (this.form.get('specific-date')?.value > TODAY) {
    //   this.hasErrors = true;
    //   console.log(ERROR_MESSAGES.FUTURE_DATE)
    // }

    //AC4 - Date range: start date is blank
    if (this.form.get('date_from')?.value !== Date && this.form.get('date_to')?.value === Date) this.hasErrors = true;
    console.log(ERROR_MESSAGES.START_DATE_MISSING);

    //AC5 - Date range: end date is blank
    if (this.form.get('date_from')?.value === Date && this.form.get('date_to')?.value !== Date) this.hasErrors = true;
    console.log(ERROR_MESSAGES.END_DATE_MISSING);

    //AC6 - Invalid Date Format
    if (this.form.get('specific')?.value !== Date) {
      this.hasErrors = true;
      console.log(ERROR_MESSAGES.INVALID_DATE);
    }
  }

  toggleRadioSelected(type: 'specific' | 'range') {
    this.dateInputType = type;
  }

  ngAfterViewChecked(): void {
    initAll();
  }

  clearSearch() {
    this.form.reset();
    this.cases = [];
    this.loaded = false;
  }
}
