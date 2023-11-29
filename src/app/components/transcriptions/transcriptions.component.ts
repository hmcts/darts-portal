import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { DatatableColumn, UserTranscriptionRequest } from '@darts-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, Observable, combineLatest, forkJoin, map, shareReplay, switchMap } from 'rxjs';

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
  ],
})
export class TranscriptionsComponent {
  transcriptService = inject(TranscriptionService);
  userService = inject(UserService);
  userState = inject(ActivatedRoute).snapshot.data.userState;
  transcriptStatusClassMap = transcriptStatusClassMap;

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number', sortable: true },
    { name: 'Court', prop: 'courthouse_name', sortable: true },
    { name: 'Hearing date', prop: 'hearing_date', sortable: true },
    { name: 'Type', prop: 'transcription_type', sortable: true },
    { name: 'Requested on', prop: 'requested_ts', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
    { name: 'Urgency', prop: 'urgency', sortable: true },
  ];
  readyColumns = [...this.columns, { name: '', prop: '' }]; //Empty column header for view link
  approverColumns = this.readyColumns.map((c) =>
    // swap status column for request id column
    c.name === 'Status' ? { name: 'Request ID', prop: 'transcription_id', sortable: true } : c
  );
  deleteColumns = this.columns.map((c) => ({ ...c, sortable: false }));

  isDeleting = false;
  selectedRequests = [] as UserTranscriptionRequest[];

  private refresh$ = new BehaviorSubject<void>(undefined);

  requests$ = this.refresh$.pipe(
    switchMap(() => this.transcriptService.getTranscriptionRequests()),
    shareReplay(1)
  );

  requesterRequests$ = combineLatest({
    inProgessRequests: this.requests$.pipe(
      map((requests) => this.filterInProgressRequests(requests.requester_transcriptions))
    ),
    completedRequests: this.requests$.pipe(
      map((requests) => this.filterReadyRequests(requests.requester_transcriptions))
    ),
    approverRequests: this.requests$.pipe(map((requests) => requests.approver_transcriptions)),
  });
  approverRequests$ = this.requests$.pipe(map((requests) => requests.approver_transcriptions));

  private filterInProgressRequests(requests: UserTranscriptionRequest[]): UserTranscriptionRequest[] {
    return requests.filter((r) => r.status === 'Awaiting Authorisation' || r.status === 'With Transcriber');
  }

  private filterReadyRequests(requests: UserTranscriptionRequest[]): UserTranscriptionRequest[] {
    return requests.filter((r) => r.status === 'Complete' || r.status === 'Rejected');
  }

  onDeleteClicked() {
    if (this.selectedRequests.length) {
      this.isDeleting = true;
    }
  }

  onDeleteConfirmed() {
    const deleteRequests: Observable<unknown>[] = this.selectedRequests.map((s) =>
      this.transcriptService.deleteRequest(s.transcription_id)
    );

    forkJoin(deleteRequests).subscribe({
      next: () => (this.isDeleting = false),
      error: () => (this.isDeleting = false),
    });

    this.refresh$.next();
  }

  onDeleteCancelled() {
    this.isDeleting = false;
  }

  onTabChanged() {
    this.selectedRequests = [];
  }

  isRequester = this.userService.isRequester();
  isApprover = this.userService.isApprover();
  isJudge = this.userService.isJudge();
}
