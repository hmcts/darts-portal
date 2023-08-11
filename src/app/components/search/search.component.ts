import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CaseService } from '../../services/case/case.service';
declare type CaseData = typeof import('../../types/case');

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  dateInputType!: 'specific' | 'range';
  private cases: CaseData[] = [];

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
    this.caseService
      .getCasesAdvanced(
        this.form.get('case_number')?.value!,
        this.form.get('courthouse')?.value,
        this.form.get('courtroom')?.value,
        this.form.get('judge_name')?.value,
        this.form.get('defendant_name')?.value,
        this.form.get('event_text_contains')?.value
      )
      .subscribe((result: CaseData[]) => {
        if (result) {
          this.cases.push(result);
        }

        console.log(this.cases);

        //GOT THE DATA

        //SEND DATA TO A SEARCH-RESULTS COMPONENT

        //LOOK AT FIGMA SEE WHERE NEW COMPONENT WILL BE INTEGRATED

        //HANDLE ERROR RESPONSES

        //STILL NEED TO INTEGRATE ERROR HANDLING IN SERVICE
      });
  }

  toggleRadioSelected(type: 'specific' | 'range') {
    this.dateInputType = type;
  }

  clearSearch() {
    this.form.reset();
  }
}
