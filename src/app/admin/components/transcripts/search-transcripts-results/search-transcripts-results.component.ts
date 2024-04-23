import { Transcription } from '@admin-types/index';
import { JsonPipe, NgClass } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-search-transcripts-results',
  standalone: true,
  imports: [JsonPipe, DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, NgClass, RouterLink],
  templateUrl: './search-transcripts-results.component.html',
  styleUrl: './search-transcripts-results.component.scss',
})
export class SearchTranscriptsResultsComponent implements OnChanges {
  @Input() results: Transcription[] = [];
  @Input() loading: boolean | null = false;

  columns: DatatableColumn[] = [
    { name: 'Request ID', prop: 'id', sortable: true },
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Requested on', prop: 'requestedOn', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
    { name: 'Request method', prop: 'requestMethod', sortable: true },
  ];

  rows: ReturnType<typeof this.mapRows> = [];

  transcriptStatusClassMap = transcriptStatusClassMap;

  ngOnChanges(): void {
    this.rows = this.mapRows(this.results);
  }

  mapRows(results: Transcription[]) {
    return results.map((result) => ({
      id: result.id,
      caseNumber: result.caseNumber,
      courthouse: result.courthouse.displayName,
      hearingDate: result.hearingDate,
      requestedOn: result.requestedAt,
      status: result.status.displayName,
      requestMethod: result.isManual,
    }));
  }
}
