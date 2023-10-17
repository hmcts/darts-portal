import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DatatableColumn, UserAudioRequest, UserAudioRequestRow } from '@darts-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { UnreadIconDirective } from '@directives/unread-icon.directive';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { HeaderService } from '@services/header/header.service';
import { Router } from 'express';
import { combineLatest, forkJoin, map, Observable } from 'rxjs';
import { AudioDeleteComponent } from './audio-delete/audio-delete.component';

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
    AudioDeleteComponent,
  ],
})
export class AudiosComponent {
  headerService = inject(HeaderService);
  audioService = inject(AudioRequestService);
  router = inject(Router);

  selectedAudioRequests: UserAudioRequestRow[] = [];

  private _isDeleting = false;
  public get isDeleting() {
    return this._isDeleting;
  }
  public set isDeleting(value) {
    this._isDeleting = value;
    this.headerService.showPrimaryNavigation(!this._isDeleting);
  }

  audioRequests$: Observable<UserAudioRequest[]>;
  expiredAudioRequests$: Observable<UserAudioRequest[]>;

  inProgessRows$!: Observable<UserAudioRequestRow[]>;
  completedRows$!: Observable<UserAudioRequestRow[]>;
  expiredRows$!: Observable<UserAudioRequestRow[]>;

  data$: Observable<{
    inProgessRows: UserAudioRequestRow[];
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
    this.audioRequests$ = this.audioService.audioRequests$;
    this.expiredAudioRequests$ = this.audioService.expiredAudioRequests$;

    this.inProgessRows$ = this.audioRequests$.pipe(
      map((audioRequests) => this.filterInProgressRequests(audioRequests)),
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );
    this.completedRows$ = this.audioRequests$.pipe(
      map((audioRequests) => this.audioService.filterCompletedRequests(audioRequests)),
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );
    this.expiredRows$ = this.expiredAudioRequests$.pipe(
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );

    this.data$ = combineLatest({
      inProgessRows: this.inProgessRows$,
      completedRows: this.completedRows$,
      expiredRows: this.expiredRows$,
    });
  }

  mapAudioRequestToRows(audioRequests: UserAudioRequest[]): UserAudioRequestRow[] {
    return audioRequests.map((ar) => {
      return {
        caseId: ar.case_id,
        caseNumber: ar.case_number,
        courthouse: ar.courthouse_name,
        hearingDate: ar.hearing_date,
        startTime: ar.media_request_start_ts,
        endTime: ar.media_request_end_ts,
        requestId: ar.media_request_id,
        expiry: ar.media_request_expiry_ts ?? null,
        status: ar.media_request_status,
        last_accessed_ts: ar.last_accessed_ts,
      };
    });
  }

  filterInProgressRequests(audioRequests: UserAudioRequest[]): UserAudioRequest[] {
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
  }

  onDeleteCancelled() {
    this.isDeleting = false;
  }

  onTabChanged() {
    this.selectedAudioRequests = [];
  }
}
