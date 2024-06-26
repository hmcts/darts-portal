import { AdminHearingSearchResult } from '@admin-types/search/admin-hearing-search-result';
import { Component, computed, input } from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-hearing-search-results',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe],
  templateUrl: './hearing-search-results.component.html',
  styleUrl: './hearing-search-results.component.scss',
})
export class HearingSearchResultsComponent {
  hearings = input<AdminHearingSearchResult[]>([]);
  caption = computed(() => `${this.hearings().length} result${this.hearings().length > 1 ? 's' : ''}`);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
  ];
}
