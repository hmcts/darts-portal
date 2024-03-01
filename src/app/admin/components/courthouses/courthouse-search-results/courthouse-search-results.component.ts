import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';

@Component({
  selector: 'app-courthouse-search-results',
  standalone: true,
  templateUrl: './courthouse-search-results.component.html',
  styleUrl: './courthouse-search-results.component.scss',
  imports: [DataTableComponent, NgClass, RouterLink, TableRowTemplateDirective],
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
