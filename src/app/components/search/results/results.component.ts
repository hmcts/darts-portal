import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { Case, DatatableColumn, DatatableRow, Hearing } from '@darts-types/index';
import { TableBodyTemplateDirective } from 'src/app/directives/table-body-template.directive';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [NgIf, NgFor, RouterLink, DataTableComponent, TableBodyTemplateDirective],
  standalone: true,
})
export class ResultsComponent implements OnChanges {
  datePipe = inject(DatePipe);
  @Input() cases: Case[] = [];
  @Input() loaded = false;
  @Input() errorType = '';
  caption = '';
  rows: DatatableRow[] = [];
  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: false },
    { name: 'Judge(s)', prop: 'judges', sortable: false },
    { name: 'Defendants(s)', prop: 'defendants', sortable: false },
  ];

  ngOnChanges(): void {
    this.rows = this.mapCasesToRows(this.cases);
    this.caption = `${this.cases.length} result${this.cases.length > 1 ? 's' : ''}`;
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
          return this.datePipe.transform(c.hearings[0][key], 'EEE dd MMM YYYY') ?? '';
        } else {
          return c.hearings[0][key] as string;
        }
      } else {
        return 'Multiple';
      }
    }
  }
}
