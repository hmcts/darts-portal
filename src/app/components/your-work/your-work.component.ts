import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { combineLatest, shareReplay, map } from 'rxjs';
import { DatatableColumn, WorkRequest } from '@darts-types/index';
import { TranscriptionService } from '@services/transcription/transcription.service';

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
  router = inject(Router);
  transcriptService = inject(TranscriptionService);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number', sortable: true },
    { name: 'Court', prop: 'courthouse_name', sortable: true },
    { name: 'Hearing date', prop: 'hearing_date', sortable: true },
    { name: 'Type', prop: 'transcription_type', sortable: true },
    { name: 'Requested on', prop: 'requested_ts', sortable: true },
    { name: 'Urgency', prop: 'urgency', sortable: true },
  ];

  readyColumns = [...this.columns, { name: '', prop: '' }]; // Empty column header for view link

  requests$ = this.transcriptService.getWorkRequests().pipe(shareReplay(1));

  requesterRequests$ = combineLatest({
    todoRequests: this.requests$.pipe(map((requests) => this.filterTodoRequests(requests))),
    completedRequests: this.requests$.pipe(map((requests) => this.filterCompletedRequests(requests))),
  });

  private filterTodoRequests(requests: WorkRequest[]): WorkRequest[] {
    return requests.filter((r) => r.status === 'WITH TRANSCRIBER');
  }

  private filterCompletedRequests(requests: WorkRequest[]): WorkRequest[] {
    return requests.filter((r) => r.status === 'COMPLETED');
  }

  onViewWorkRequest(event: MouseEvent, workRequest: WorkRequest) {
    event.preventDefault();
    // Placeholder until transcript upload screen is finalised
    this.router.navigate(['/work/', workRequest.transcription_id]);
  }
}
