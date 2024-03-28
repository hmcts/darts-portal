import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@components/common/data-table/data-table.component';
import { DeleteComponent } from '@components/common/delete/delete.component';
import { GovukHeadingComponent } from '@components/common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { TabsComponent } from '@components/common/tabs/tabs.component';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { transcriptTableColumns } from '@constants/transcription-columns';
import { DatatableColumn } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptRequest } from '@portal-types/index';
import { SortService } from '@services/sort/sort.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, combineLatest, map, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-transcriptions',
  templateUrl: './transcriptions.component.html',
  styleUrls: ['./transcriptions.component.scss'],
  standalone: true,
  imports: [
    DataTableComponent,
    LoadingComponent,
    TabsComponent,
    CommonModule,
    TableRowTemplateDirective,
    RouterLink,
    TabDirective,
    DeleteComponent,
    ForbiddenComponent,
    GovukHeadingComponent,
    LuxonDatePipe,
  ],
})
export class TranscriptionsComponent {
  transcriptService = inject(TranscriptionService);
  userService = inject(UserService);
  userState = inject(ActivatedRoute).snapshot.data.userState;
  sortService = inject(SortService);
  router = inject(Router);
  transcriptStatusClassMap = transcriptStatusClassMap;

  columns: DatatableColumn[] = [
    ...transcriptTableColumns,
    { name: 'Status', prop: 'status', sortable: true },
    {
      name: 'Urgency',
      prop: 'urgency',
      sortable: true,
      customSortFn: this.sortService.sortByUrgencyPriorityOrder,
    },
  ];
  readyColumns = [...this.columns, { name: '', prop: '' }]; //Empty column header for view link
  approverColumns = this.readyColumns.map((c) =>
    // swap status column for request id column
    c.name === 'Status' ? { name: 'Request ID', prop: 'transcriptionId', sortable: true } : c
  );
  deleteColumns = this.columns.map((c) => ({ ...c, sortable: false }));

  isDeleting = false;
  selectedRequests = [] as TranscriptRequest[];

  private refresh$ = new BehaviorSubject<void>(undefined);

  requests$ = this.refresh$.pipe(
    switchMap(() => this.transcriptService.getYourTranscripts()),
    shareReplay(1)
  );

  requesterRequests$ = combineLatest({
    inProgressRequests: this.requests$.pipe(
      map((requests) => this.filterInProgressRequests(requests.requesterTranscriptions))
    ),
    completedRequests: this.requests$.pipe(
      map((requests) => this.filterReadyRequests(requests.requesterTranscriptions))
    ),
    approverRequests: this.requests$.pipe(map((requests) => requests.approverTranscriptions)),
  });
  approverRequests$ = this.requests$.pipe(map((requests) => requests.approverTranscriptions));

  private filterInProgressRequests(requests: TranscriptRequest[]): TranscriptRequest[] {
    return requests.filter((r) => r.status === 'Awaiting Authorisation' || r.status === 'With Transcriber');
  }

  private filterReadyRequests(requests: TranscriptRequest[]): TranscriptRequest[] {
    return requests.filter((r) => r.status === 'Complete' || r.status === 'Rejected');
  }

  onDeleteClicked() {
    if (this.selectedRequests.length) {
      this.isDeleting = true;
    }
  }

  onDeleteConfirmed() {
    const idsToDelete = this.selectedRequests.map((s) => s.transcriptionId);

    this.transcriptService.deleteRequest(idsToDelete).subscribe({
      next: () => {
        this.isDeleting = false;
        this.refresh$.next();
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting = false;
        if (error.status === 400) {
          this.router.navigate(['transcriptions/delete-error']);
        }
      },
    });
  }

  onDeleteCancelled() {
    this.isDeleting = false;
  }

  onTabChanged() {
    this.selectedRequests = [];
  }

  get deleteScreenTitle(): string {
    return this.selectedRequests.length === 1
      ? 'Are you sure you want to remove this transcript request?'
      : 'Are you sure you want to remove these transcript requests?';
  }

  get deleteScreenText(): string {
    return this.selectedRequests.length === 1
      ? 'This action will remove this transcript request from your transcripts. You can still access it by searching at the hearing and case levels.'
      : 'This action will remove these transcript requests from your transcripts. You can still access them by searching at the hearing and case levels.';
  }

  isRequester = this.userService.isRequester();
  isApprover = this.userService.isApprover();
  isJudge = this.userService.isJudge();
  isSuperUser = this.userService.isSuperUser();
}
