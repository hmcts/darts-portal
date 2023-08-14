import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseService } from '../../services/case/case.service';
import { CaseData } from '../../../app/types/case';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  dateInputType!: 'specific' | 'range';
  cases: CaseData[] = [];
  loaded: boolean = false;
  msg: string = '';

  constructor(private caseService: CaseService) {}

  form = new FormGroup({
    case_number: new FormControl('', Validators.required),
    courthouse: new FormControl(),
    courtroom: new FormControl(),
    judge_name: new FormControl(),
    defendant_name: new FormControl(),
    event_text_contains: new FormControl(),
    //NEED DATE TO AND FROM FROM DMP-515
  });

  // Submit Registration Form
  onSubmit() {
    this.cases = [];

    this.caseService
      .getCasesAdvanced(
        this.form.get('case_number')?.value!,
        this.form.get('courthouse')?.value,
        this.form.get('courtroom')?.value,
        this.form.get('judge_name')?.value,
        this.form.get('defendant_name')?.value,
        this.form.get('event_text_contains')?.value
      )
      .subscribe(
        (result: CaseData[]) => {
          if (result) {
            this.cases = this.cases.concat(result);
            this.loaded = true;
            this.msg = 'ok';
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          // Handle error
          // Use if conditions to check error code, this depends on your api, how it sends error messages
          //HANDLE ERROR RESPONSES
          //Check if not ok, show appropriate message based on response
          //If http status and inspect statusText e.g. HttpStatus.BAD_REQUEST
          //https://angular.io/api/common/http/HttpResponse
        }
      );
  }

  toggleRadioSelected(type: 'specific' | 'range') {
    this.dateInputType = type;
  }

  clearSearch() {
    this.form.reset();
    this.cases = [];
  }
}
