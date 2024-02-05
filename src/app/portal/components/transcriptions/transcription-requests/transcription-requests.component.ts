import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { transcriptTableColumns } from '@constants/transcription-columns';
import { DatatableColumn } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { SortService } from '@services/sort/sort.service';
import { TranscriptionService } from 'src/app/portal/services/transcription/transcription.service';

@Component({
  selector: 'app-transcription-requests',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TableRowTemplateDirective, RouterLink, LoadingComponent, LuxonDatePipe],
  templateUrl: './transcription-requests.component.html',
  styleUrl: './transcription-requests.component.scss',
})
export class TranscriptionRequestsComponent {
  transcriptionService = inject(TranscriptionService);
  sortService = inject(SortService);

  columns: DatatableColumn[] = [
    ...transcriptTableColumns,
    { name: 'Method', prop: 'isManual', sortable: true },
    {
      name: 'Urgency',
      prop: 'urgency',
      sortable: true,
      customSortFn: this.sortService.sortByUrgencyPriorityOrder,
    },
    { name: '', prop: '' },
  ];

  transcriptRequests$ = this.transcriptionService.unassignedRequests$;
}
