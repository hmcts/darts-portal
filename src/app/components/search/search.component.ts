import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { initAll } from '@scottish-government/pattern-library/src/all';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseService } from '../../services/case/case.service';
import { CaseData } from '../../../app/types/case';
import { ResultsComponent } from './results/results.component';
import { CourthouseData } from '../../../app/types/courthouse';
import accessibleAutocomplete, { AccessibleAutocompleteProps } from 'accessible-autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ResultsComponent],
})
export class SearchComponent implements AfterViewChecked, AfterViewInit {
  @ViewChild('courthouseAutocomplete', { static: false }) autocomplete!: ElementRef<HTMLElement>;
  dateInputType!: 'specific' | 'range';
  cases: CaseData[] = [];
  courthouses: CourthouseData[] = [];
  loaded = false;
  errorType = '';

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

  clearSearch() {
    (document.querySelector("[name='courthouse']") as HTMLInputElement).value = '';
    this.form.reset();
    this.cases = [];
    this.loaded = false;
  }
}
