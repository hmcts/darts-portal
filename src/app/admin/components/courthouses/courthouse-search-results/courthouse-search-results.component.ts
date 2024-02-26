import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';

@Component({
  selector: 'app-courthouse-search-results',
  standalone: true,
  templateUrl: './courthouse-search-results.component.html',
  styleUrl: './courthouse-search-results.component.scss',
  imports: [DataTableComponent, NgClass],
})
export class CourthouseSearchResultsComponent {
  @Input() results: Courthouse[] = [];

  columns: DatatableColumn[] = [
    { name: 'Courthouse name', prop: 'courthouseName', sortable: true },
    { name: 'Display name', prop: 'displayName', sortable: true },
    { name: 'Region', prop: 'regionName', sortable: true },
  ];

  get caption() {
    return `${this.results.length} result${this.results.length > 1 ? 's' : ''}`;
  }
}
