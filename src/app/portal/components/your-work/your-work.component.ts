import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DataTableComponent } from '@components/common/data-table/data-table.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { TabsComponent } from '@components/common/tabs/tabs.component';
import { transcriptTableColumns } from '@constants/transcription-columns';
import { DatatableColumn } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { WorkRequest } from '@portal-types/index';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
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
    LuxonDatePipe,
    GovukHeadingComponent,
  ],
})
export class YourWorkComponent {
  transcriptionService = inject(TranscriptionService);
  tabsService = inject(ActiveTabService);
  sortService = inject(SortService);
  destroyRef = inject(DestroyRef);

  private readonly screenId = 'your-work';
  tab = this.tabsService.activeTabs()[this.screenId] ?? 'To do';

  columns: DatatableColumn[] = [
    ...transcriptTableColumns,
    {
      name: 'Urgency',
      prop: 'urgency',
      sortable: true,
      customSortFn: this.sortService.sortByUrgencyPriorityOrder,
    },
  ];

  readyColumns = [...this.columns, { name: 'View request links', prop: '', hidden: true }]; // Empty column header for view link

  requests$ = this.transcriptionService.assignedRequests$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .pipe(shareReplay(1));

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

  onTabChange($event: TabDirective) {
    this.tabsService.setActiveTab(this.screenId, $event.name);
  }
}
