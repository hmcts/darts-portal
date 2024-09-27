import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-transcripts-for-deletion',
  standalone: true,
  imports: [LuxonDatePipe, DataTableComponent, RouterLink, TableRowTemplateDirective],
  templateUrl: './transcripts-for-deletion.component.html',
  styleUrl: './transcripts-for-deletion.component.scss',
})
export class TranscriptsForDeletionComponent {
  rows = input<TranscriptionDocumentForDeletion[]>([]);
  deletion = output<TranscriptionDocumentForDeletion>();

  showDeleteButton = input(true);

  columns = signal<DatatableColumn[]>([
    { prop: 'transcriptId', name: 'Transcript ID' },
    { prop: 'caseId', name: 'Case ID' },
    { prop: 'hearingDate', name: 'Hearing date' },
    { prop: 'courthouse', name: 'Courthouse' },
    { prop: 'courtroom', name: 'Courtroom' },
    { prop: 'markedHiddenBy', name: 'Marked by' },
    { prop: 'comments', name: 'Comments' },
    { prop: '', name: '' },
  ]);

  deleteTranscript(transcript: TranscriptionDocumentForDeletion): void {
    this.deletion.emit(transcript);
  }
}
