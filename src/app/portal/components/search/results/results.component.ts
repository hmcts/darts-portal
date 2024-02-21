import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableBodyTemplateDirective } from '@directives/table-body-template.directive';
import { ArrayDisplayPipe } from '@pipes/array-display.pipe';
import { CaseSearchResult } from '@portal-types/index';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [NgIf, NgFor, RouterLink, DataTableComponent, TableBodyTemplateDirective, ArrayDisplayPipe],
  standalone: true,
})
export class ResultsComponent implements OnChanges {
  @Input() cases: CaseSearchResult[] = [];
  @Input() loaded = false;
  @Input() errorType = '';
  caption = '';
  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'number', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: false },
    { name: 'Judge(s)', prop: 'judges', sortable: false },
    { name: 'Defendants(s)', prop: 'defendants', sortable: false },
  ];

  ngOnChanges(): void {
    this.caption = `${this.cases.length} result${this.cases.length > 1 ? 's' : ''}`;
  }
}
