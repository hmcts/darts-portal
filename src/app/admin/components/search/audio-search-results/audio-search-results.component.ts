import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AdminMediaSearchResult } from './../../../models/search/admin-media-search-result';

@Component({
  selector: 'app-audio-search-results',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, RouterLink],
  templateUrl: './audio-search-results.component.html',
  styleUrl: './audio-search-results.component.scss',
})
export class AudioSearchResultsComponent {
  audio = input<AdminMediaSearchResult[]>([]);
  caption = computed(() => `${this.audio().length} result${this.audio().length > 1 ? 's' : ''}`);

  columns: DatatableColumn[] = [
    { name: 'Audio ID', prop: 'id', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'Hearing Date', prop: 'hearingDate', sortable: true },
    { name: 'Start Time', prop: 'startAt', sortable: true },
    { name: 'End Time', prop: 'endAt', sortable: true },
    { name: 'Channel', prop: 'channel', sortable: true },
    { name: 'Hidden', prop: 'isHidden', sortable: true },
  ];
}
