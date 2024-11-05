import { AdminEventSearchResult } from '@admin-types/search/admin-event-search-result';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableBodyTemplateDirective } from '@directives/table-body-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-event-search-results',
  standalone: true,
  imports: [DataTableComponent, TableBodyTemplateDirective, LuxonDatePipe, RouterLink],
  templateUrl: './event-search-results.component.html',
  styleUrl: './event-search-results.component.scss',
})
export class EventSearchResultsComponent {
  events = input<AdminEventSearchResult[]>([]);
  caption = computed(() => `event result${this.events().length > 1 ? 's' : ''}`);

  columns: DatatableColumn[] = [
    { name: 'Event ID', prop: 'id', sortable: true },
    { name: 'Time stamp', prop: 'eventTs', sortable: true, sortOnLoad: 'asc' },
    { name: 'Name', prop: 'name', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'Text', prop: 'text', sortable: true },
  ];
}
