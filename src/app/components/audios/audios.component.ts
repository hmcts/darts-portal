import { DataTableComponent } from '@common/data-table/data-table.component';
import { Component, inject } from '@angular/core';
import { TabsComponent } from '@common/tabs/tabs.component';
import { AudioService } from '@services/audio/audio.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, forkJoin, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { TableRowTemplateDirective } from 'src/app/directives/table-row-template.directive';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabDirective } from 'src/app/directives/tab.directive';
import { UnreadIconDirective } from '@directives/unread-icon.directive';
import { HeaderService } from '@services/header/header.service';
import { DatatableColumn, UserAudioRequestRow } from '@darts-types/index';

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
  ],
})
export class AudiosComponent {
  headerService = inject(HeaderService);
  audioService = inject(AudioService);

  userId: number;

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

  unSortableColumns = this.columns.map((col) => ({ ...col, sortable: false }));

  readyColumns = [{ name: '', prop: '' }, ...this.columns]; //Empty column for unread icon

  constructor(private route: ActivatedRoute) {
    this.userId = this.route.snapshot.data.userState.userId;

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
        // id: ar.case_id,
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

  onDeleteCancelled(event: MouseEvent) {
    event.preventDefault();
    this.isDeleting = false;
  }

  onTabChanged() {
    this.selectedAudioRequests = [];
  }
}
