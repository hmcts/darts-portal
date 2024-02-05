import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { transcriptTableColumns } from '@constants/transcription-columns';
import { DatatableColumn } from '@darts-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { WorkRequest } from '@portal-types/index';
import { SortService } from '@services/sort/sort.service';
import { combineLatest, map, shareReplay } from 'rxjs';
import { TranscriptionService } from 'src/app/portal/services/transcription/transcription.service';

@Component({
  selector: 'app-your-work',
  templateUrl: './your-work.component.html',
  styleUrls: ['./your-work.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    RouterLink,
    LoadingComponent,
    TabsComponent,
    TabDirective,
    TableRowTemplateDirective,
    LuxonDatePipe,
  ],
})
export class YourWorkComponent {
  transcriptionService = inject(TranscriptionService);
  sortService = inject(SortService);

  columns: DatatableColumn[] = [
    ...transcriptTableColumns,
    {
      name: 'Urgency',
      prop: 'urgency',
      sortable: true,
      customSortFn: this.sortService.sortByUrgencyPriorityOrder,
    },
  ];

  readyColumns = [...this.columns, { name: '', prop: '' }]; // Empty column header for view link

  requests$ = this.transcriptionService.assignedRequests$.pipe(shareReplay(1));

  requesterRequests$ = combineLatest({
    todoRequests: this.requests$.pipe(map((requests) => this.filterTodoRequests(requests))),
    completedRequests: this.requests$.pipe(map((requests) => this.filterCompletedRequests(requests))),
  });

  private filterTodoRequests(requests: WorkRequest[]): WorkRequest[] {
    return requests.filter((r) => r.status === 'With Transcriber');
  }

  private filterCompletedRequests(requests: WorkRequest[]): WorkRequest[] {
    return requests.filter((r) => r.status === 'Complete');
  }
}
