import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-transcripts-for-deletion',
  standalone: true,
  imports: [LuxonDatePipe, DataTableComponent, RouterLink, TableRowTemplateDirective, CommonModule],
  templateUrl: './transcripts-for-deletion.component.html',
  styleUrl: './transcripts-for-deletion.component.scss',
})
export class TranscriptsForDeletionComponent implements OnInit {
  rows = input<TranscriptionDocumentForDeletion[]>([]);
  deletion = output<TranscriptionDocumentForDeletion>();

  //Signifies whether in delete transcript file view
  showDeleteButton = input(true);

  columns = signal<DatatableColumn[]>([]);

  hideTranscriptColumns: DatatableColumn[] = [
    { prop: 'transcriptId', name: 'Transcript ID' },
    { prop: 'caseId', name: 'Case ID' },
    { prop: 'courthouse', name: 'Courthouse' },
    { prop: 'hearingDate', name: 'Hearing date' },
    { prop: 'markedHiddenBy', name: 'Marked by' },
    { prop: 'comments', name: 'Comments' },
  ];

  defaultColumns: DatatableColumn[] = [
    { prop: 'transcriptId', name: 'Transcript ID' },
    { prop: 'caseId', name: 'Case ID' },
    { prop: 'hearingDate', name: 'Hearing date' },
    { prop: 'courthouse', name: 'Courthouse' },
    { prop: 'courtroom', name: 'Courtroom' },
    { prop: 'markedHiddenBy', name: 'Marked by' },
    { prop: 'comments', name: 'Comments' },
    { prop: '', name: 'Delete' },
  ];

  ngOnInit(): void {
    this.columns = signal<DatatableColumn[]>(
      this.showDeleteButton() ? this.defaultColumns : this.hideTranscriptColumns
    );
  }

  deleteTranscript(transcript: TranscriptionDocumentForDeletion): void {
    this.deletion.emit(transcript);
  }
}
