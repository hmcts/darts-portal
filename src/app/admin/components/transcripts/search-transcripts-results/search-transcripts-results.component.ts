import { Transcription } from '@admin-types/index';
import { NgClass } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptStatus } from '@portal-types/index';

@Component({
  selector: 'app-search-transcripts-results',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, NgClass, RouterLink, GovukTagComponent],
  templateUrl: './search-transcripts-results.component.html',
  styleUrl: './search-transcripts-results.component.scss',
})
export class SearchTranscriptsResultsComponent implements OnChanges {
  @Input() results: Transcription[] = [];

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

  transcriptStatusClassMap = transcriptStatusTagColours;

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
      status: result.status.displayName as TranscriptStatus,
      requestMethod: result.isManual,
    }));
  }
}
