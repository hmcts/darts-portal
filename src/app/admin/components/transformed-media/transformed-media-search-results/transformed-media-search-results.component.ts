import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { DecimalPipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { BytesPipe } from '@pipes/bytes.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-transformed-media-search-results',
  standalone: true,
  imports: [DataTableComponent, RouterLink, LuxonDatePipe, TableRowTemplateDirective, BytesPipe, DecimalPipe],
  templateUrl: './transformed-media-search-results.component.html',
  styleUrl: './transformed-media-search-results.component.scss',
})
export class TransformedMediaSearchResultsComponent implements OnChanges {
  @Input() results: TransformedMediaAdmin[] = [];

  columns: DatatableColumn[] = [
    { name: 'Media ID', prop: 'id', sortable: true },
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Owner', prop: 'owner', sortable: true },
    { name: 'Requested by', prop: 'requestedBy', sortable: true },
    { name: 'Date requested', prop: 'requestedDate', sortable: true },
    { name: 'Last accessed', prop: 'lastAccessed', sortable: true },
    { name: 'File type', prop: 'fileType', sortable: true },
    { name: 'Size', prop: 'size', sortable: true },
    { name: 'Filename', prop: 'filename', sortable: true },
  ];

  rows: ReturnType<typeof this.mapRows> = [];

  ngOnChanges(): void {
    this.rows = this.mapRows(this.results);
  }

  mapRows(results: TransformedMediaAdmin[]) {
    return results.map((result) => ({
      id: result.id,
      caseNumber: result.case.caseNumber,
      courthouse: result.courthouse.displayName,
      hearingDate: result.hearing.hearingDate,
      owner: result.mediaRequest.ownerUserName,
      requestedBy: result.mediaRequest.ownerUserName,
      requestedDate: result.mediaRequest.requestedAt,
      lastAccessed: result.lastAccessedAt,
      fileType: result.fileFormat,
      size: result.fileSizeBytes,
      filename: result.fileName,
    }));
  }
}
