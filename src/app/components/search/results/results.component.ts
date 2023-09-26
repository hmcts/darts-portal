import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { Case, Hearing } from '@darts-types/index';
import { DateTimeService } from '@services/datetime/datetime.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [NgIf, NgFor, RouterLink, DataTableComponent],
  standalone: true,
})
export class ResultsComponent implements OnChanges {
  @Input() cases: Case[] = [];
  @Input() loaded = false;
  @Input() errorType = '';
  caption = '';
  rows: any[] = [];
  columns = [
    { name: 'Case ID', prop: 'caseNumber', sortable: true, link: '/case' },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: false },
    { name: 'Judge(s)', prop: 'judges', sortable: false },
    { name: 'Defendants(s)', prop: 'defendants', sortable: false },
  ];

  ngOnChanges(): void {
    this.rows = this.mapCasesToRows(this.cases);
    this.caption = `${this.cases.length} result${this.cases.length > 0 ? 's' : ''}`;
  }

  mapCasesToRows(cases: Case[]) {
    return cases.map((c) => {
      return {
        id: c.case_id,
        caseNumber: c.case_number,
        courthouse: c.courthouse,
        courtroom: this.getHearingsValue(c, 'courtroom'),
        judges: this.getNameValue(c.judges),
        defendants: this.getNameValue(c.defendants),
        reporting_restriction: c.reporting_restriction,
      };
    });
  }

  //Fetches correct display value for defendants and judges
  getNameValue(arr: string[] | undefined): string {
    if (arr) {
      if (arr.length === 0) {
        return '';
      } else {
        if (arr.length < 2) {
          return arr[0];
        } else {
          return 'Multiple';
        }
      }
    } else {
      return '';
    }
  }

  //Fetches correct display value for dates and courtrooms
  getHearingsValue(c: Case, key: keyof Hearing): string {
    if (!c.hearings || c.hearings.length === 0) {
      return '';
    } else {
      if (c.hearings.length < 2) {
        if (key === 'date') {
          return this.getDateFormat(c.hearings[0][key]);
        } else {
          return c.hearings[0][key] as string;
        }
      } else {
        return 'Multiple';
      }
    }
  }

  isErrorHandledInTemplate() {
    return (
      this.errorType !== 'CASE_100' &&
      this.errorType !== 'CASE_101' &&
      this.errorType !== 'CASE_102' &&
      this.errorType !== 'ok'
    );
  }

  private getDateFormat(d: string): string {
    return DateTimeService.getdddDMMMYYYY(d);
  }
}
