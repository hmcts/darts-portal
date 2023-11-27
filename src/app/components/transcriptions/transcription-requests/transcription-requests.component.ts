import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { RouterLink } from '@angular/router';
import { DatatableColumn } from '@darts-types/index';
import { LoadingComponent } from '@common/loading/loading.component';

@Component({
  selector: 'app-transcription-requests',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TableRowTemplateDirective, RouterLink, LoadingComponent],
  templateUrl: './transcription-requests.component.html',
  styleUrl: './transcription-requests.component.scss',
})
export class TranscriptionRequestsComponent {
  transcriptionService = inject(TranscriptionService);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number', sortable: true },
    { name: 'Court', prop: 'courthouse_name', sortable: true },
    { name: 'Hearing date', prop: 'hearing_date', sortable: true },
    { name: 'Type', prop: 'transcription_type', sortable: true },
    { name: 'Requested on', prop: 'requested_ts', sortable: true },
    { name: 'Method', prop: 'is_manual', sortable: true },
    { name: 'Urgency', prop: 'urgency', sortable: true },
    { name: '', prop: '' },
  ];

  transcriptRequests$ = this.transcriptionService.getTranscriberTranscriptions();
}
