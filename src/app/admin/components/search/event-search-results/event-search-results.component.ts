import { AdminEventSearchResult } from '@admin-types/search/admin-event-search-result';
import { Component, computed, input } from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-event-search-results',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe],
  templateUrl: './event-search-results.component.html',
  styleUrl: './event-search-results.component.scss',
})
export class EventSearchResultsComponent {
  events = input<AdminEventSearchResult[]>([]);
  caption = computed(() => `${this.events().length} result${this.events().length > 1 ? 's' : ''}`);

  columns: DatatableColumn[] = [
    { name: 'Event ID', prop: 'number', sortable: true },
    { name: 'Time stamp', prop: 'createdAt', sortable: true },
    { name: 'Name', prop: 'name', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'Text', prop: 'text', sortable: true },
    { name: 'Chronicle ID', prop: 'chronicleId', sortable: true },
    { name: 'Antecedent ID', prop: 'antecedentId', sortable: true },
  ];
}
