import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DatatableColumn, MediaRequest, MediaRequests, UserAudioRequestRow } from '@darts-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { UnreadIconDirective } from '@directives/unread-icon.directive';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { HeaderService } from '@services/header/header.service';
import { BehaviorSubject, Observable, combineLatest, forkJoin, map, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-audios',
  templateUrl: './audios.component.html',
  styleUrls: ['./audios.component.scss'],
  standalone: true,
  imports: [
    DataTableComponent,
    LoadingComponent,
    TabsComponent,
    CommonModule,
    TableRowTemplateDirective,
    UnreadIconDirective,
    RouterLink,
    TabDirective,
    DeleteComponent,
  ],
})
export class AudiosComponent {
  headerService = inject(HeaderService);
  audioService = inject(AudioRequestService);
  router = inject(Router);

  private refresh$ = new BehaviorSubject<void>(undefined);

  selectedAudioRequests: UserAudioRequestRow[] = [];

  isDeleting = false;

  audioRequests$: Observable<MediaRequests>;
  expiredAudioRequests$: Observable<MediaRequests>;

  inProgress$!: Observable<UserAudioRequestRow[]>;
  completedRows$!: Observable<UserAudioRequestRow[]>;
  expiredRows$!: Observable<UserAudioRequestRow[]>;

  data$: Observable<{
    inProgressRows: UserAudioRequestRow[];
    completedRows: UserAudioRequestRow[];
    expiredRows: UserAudioRequestRow[];
  }>;

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Court', prop: 'courthouse', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Start time', prop: 'startTime', sortable: true },
    { name: 'End time', prop: 'endTime', sortable: true },
    { name: 'Request ID', prop: 'requestId', sortable: true },
    { name: 'Expiry date', prop: 'expiry', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
  ];

  readyColumns = [{ name: '', prop: '' }, ...this.columns, { name: '', prop: '' }]; //Empty columns for unread icon and view link

  constructor() {
    this.audioRequests$ = this.refresh$.pipe(
      switchMap(() => this.audioService.audioRequests$),
      shareReplay(1)
    );

    this.expiredAudioRequests$ = this.refresh$.pipe(
      switchMap(() => this.audioService.expiredAudioRequests$),
      shareReplay(1)
    );

    this.inProgress$ = this.audioRequests$.pipe(
      map((audioRequests) => this.filterInProgressRequests(audioRequests.media_request_details)),
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );
    this.completedRows$ = this.audioRequests$.pipe(
      map((audioRequests) => this.audioService.filterCompletedRequests(audioRequests.transformed_media_details)),
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );
    this.expiredRows$ = this.expiredAudioRequests$.pipe(
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests.transformed_media_details))
    );

    this.data$ = combineLatest({
      inProgressRows: this.inProgress$,
      completedRows: this.completedRows$,
      expiredRows: this.expiredRows$,
    });
  }

  mapAudioRequestToRows(audioRequests: MediaRequest[]): UserAudioRequestRow[] {
    return audioRequests.map((ar) => {
      return {
        caseId: ar.case_id,
        caseNumber: ar.case_number,
        courthouse: ar.courthouse_name,
        hearingId: ar.hearing_id,
        hearingDate: ar.hearing_date,
        startTime: ar.start_ts,
        endTime: ar.end_ts,
        requestId: ar.media_request_id,
        expiry: ar.transformed_media_expiry_ts,
        status: ar.media_request_status,
        lastAccessed: ar.last_accessed_ts,
        requestType: ar.request_type,
        output_filename: ar.transformed_media_filename,
        output_format: ar.transformed_media_format,
      };
    });
  }

  filterInProgressRequests(audioRequests: MediaRequest[]): MediaRequest[] {
    return audioRequests.filter(
      (ar) =>
        ar.media_request_status === 'OPEN' ||
        ar.media_request_status === 'PROCESSING' ||
        ar.media_request_status === 'FAILED'
    );
  }

  onViewAudioRequest(event: MouseEvent, audioRequestRow: UserAudioRequestRow) {
    event.preventDefault();
    // Store audio request in service for retrieval on view screen
    this.audioService.setAudioRequest(audioRequestRow);
    this.router.navigate(['./audios', audioRequestRow.requestId]);
  }

  onSelectedAudio(selectedAudio: UserAudioRequestRow[]) {
    this.selectedAudioRequests = selectedAudio;
  }

  onDeleteClicked() {
    if (this.selectedAudioRequests.length) {
      this.isDeleting = true;
    }
  }

  onDeleteConfirmed() {
    const deleteRequests: Observable<unknown>[] = this.selectedAudioRequests.map((s) =>
      this.audioService.deleteAudioRequests(s.requestId)
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
    this.selectedAudioRequests = [];
  }

  onClearClicked(event: MouseEvent, row: UserAudioRequestRow) {
    event.preventDefault();
    this.selectedAudioRequests = [row];
    this.isDeleting = true;
  }
}
