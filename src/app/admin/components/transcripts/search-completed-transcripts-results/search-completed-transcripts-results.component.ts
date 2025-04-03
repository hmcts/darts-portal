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
    { name: 'Request ID', prop: 'requestId', sortable: true },
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Request method', prop: 'requestMethod', sortable: true },
    { name: 'Is hidden', prop: 'isHidden', sortable: true },
  ];

  ngOnChanges() {
    this.rows = this.mapRows(this.results);
  }

  mapRows(results: TranscriptionDocumentSearchResult[]) {
    return results.map((result) => ({
      id: result.transcriptionDocumentId,
      requestId: result.transcriptionId,
      caseId: result.case.id,
      caseNumber: result.case.caseNumber,
      courthouse: result.courthouse.displayName,
      hearingDate: result.hearing.hearingDate,
      requestMethod: result.isManualTranscription,
      isHidden: result.isHidden,
    }));
  }
}
