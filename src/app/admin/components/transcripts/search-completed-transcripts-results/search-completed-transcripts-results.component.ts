import { TranscriptionDocumentSearchResult } from '@admin-types/transcription';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-search-completed-transcripts-results',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink, LuxonDatePipe],
  templateUrl: './search-completed-transcripts-results.component.html',
  styleUrl: './search-completed-transcripts-results.component.scss',
})
export class SearchCompletedTranscriptsResultsComponent implements OnChanges {
  @Input() results: TranscriptionDocumentSearchResult[] = [];

  rows: ReturnType<typeof this.mapRows> = [];

  columns: DatatableColumn[] = [
    { name: 'Transcript ID', prop: 'id', sortable: true },
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Hearing Date', prop: 'hearingDate', sortable: true },
    { name: 'Request Method', prop: 'requestMethod', sortable: true },
  ];

  ngOnChanges() {
    this.rows = this.mapRows(this.results);
  }

  mapRows(results: TranscriptionDocumentSearchResult[]) {
    return results.map((result) => ({
      id: result.transcriptionDocumentId,
      caseNumber: result.case ? result.case.caseNumber : undefined,
      courthouse: result.courthouse ? result.courthouse.displayName : undefined,
      hearingDate: result.hearing ? result.hearing.hearingDate : undefined,
      requestMethod: result.isManualTranscription,
    }));
  }
}
