import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { SortService } from '@services/sort/sort.service';
import { TranscriptionService } from '@services/transcription/transcription.service';

@Component({
  selector: 'app-transcription-requests',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TableRowTemplateDirective, RouterLink, LoadingComponent],
  templateUrl: './transcription-requests.component.html',
  styleUrl: './transcription-requests.component.scss',
})
export class TranscriptionRequestsComponent {
  transcriptionService = inject(TranscriptionService);
  customSortFunctionService = inject(SortService);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number', sortable: true },
    { name: 'Court', prop: 'courthouse_name', sortable: true },
    { name: 'Hearing date', prop: 'hearing_date', sortable: true },
    { name: 'Type', prop: 'transcription_type', sortable: true },
    { name: 'Requested on', prop: 'requested_ts', sortable: true },
    { name: 'Method', prop: 'is_manual', sortable: true },
    {
      name: 'Urgency',
      prop: 'urgency',
      sortable: true,
      customSortFn: this.customSortFunctionService.sortByUrgencyPriorityOrder,
    },
    { name: '', prop: '' },
  ];

  transcriptRequests$ = this.transcriptionService.unassignedRequests$;
}
