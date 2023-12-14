import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DatatableColumn, WorkRequestVm } from '@darts-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { SortService } from '@services/sort/sort.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { combineLatest, map, shareReplay } from 'rxjs';

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
  ],
})
export class YourWorkComponent {
  transcriptionService = inject(TranscriptionService);
  customSortService = inject(SortService);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number', sortable: true },
    { name: 'Court', prop: 'courthouse_name', sortable: true },
    { name: 'Hearing date', prop: 'hearing_date', sortable: true },
    { name: 'Type', prop: 'transcription_type', sortable: true },
    { name: 'Requested on', prop: 'requested_ts', sortable: true },
    {
      name: 'Urgency',
      prop: 'urgency',
      sortable: true,
      customSortFn: this.customSortService.sortByUrgencyPriorityOrder,
    },
  ];

  readyColumns = [...this.columns, { name: '', prop: '' }]; // Empty column header for view link

  requests$ = this.transcriptionService.assignedRequests$.pipe(shareReplay(1));

  requesterRequests$ = combineLatest({
    todoRequests: this.requests$.pipe(map((requests) => this.filterTodoRequests(requests))),
    completedRequests: this.requests$.pipe(map((requests) => this.filterCompletedRequests(requests))),
  });

  private filterTodoRequests(requests: WorkRequestVm[]): WorkRequestVm[] {
    return requests.filter((r) => r.status === 'With Transcriber');
  }

  private filterCompletedRequests(requests: WorkRequestVm[]): WorkRequestVm[] {
    return requests.filter((r) => r.status === 'Complete');
  }
}
