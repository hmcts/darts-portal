import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DatatableColumn } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { UnreadIconDirective } from '@directives/unread-icon.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { MediaRequest, RequestedMedia, TransformedMedia } from '@portal-types/index';
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
    LuxonDatePipe,
  ],
})
export class AudiosComponent {
  headerService = inject(HeaderService);
  audioService = inject(AudioRequestService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  private refresh$ = new BehaviorSubject<void>(undefined);

  selectedAudioRequests: TransformedMedia[] = [];

  isDeleting = false;
  isAudioRequest = false;

  audioRequests$: Observable<RequestedMedia>;
  expiredAudioRequests$: Observable<RequestedMedia>;

  data$: Observable<{
    inProgressRows: MediaRequest[];
    completedRows: TransformedMedia[];
    expiredRows: TransformedMedia[];
  }>;

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouseName', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Start time', prop: 'startTime', sortable: true },
    { name: 'End time', prop: 'endTime', sortable: true },
    { name: 'Request ID', prop: 'mediaRequestId', sortable: true },
    { name: 'Expiry date', prop: 'transformedMediaExpiryTs', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
  ];

  readyColumns = [{ name: '', prop: '' }, ...this.columns, { name: '', prop: '' }]; //Empty columns for unread icon and view link

  constructor() {
    this.audioRequests$ = this.refresh$.pipe(
      switchMap(() => this.audioService.audioRequests$.pipe(takeUntilDestroyed(this.destroyRef))),
      shareReplay(1)
    );

    this.expiredAudioRequests$ = this.refresh$.pipe(
      switchMap(() => this.audioService.expiredAudioRequests$.pipe(takeUntilDestroyed(this.destroyRef))),
      shareReplay(1)
    );

    this.data$ = combineLatest({
      inProgressRows: this.audioRequests$.pipe(map((requestedMedia) => requestedMedia.mediaRequests)),
      completedRows: this.audioRequests$.pipe(map((requestedMedia) => requestedMedia.transformedMedia)),
      expiredRows: this.expiredAudioRequests$.pipe(map((requestedMedia) => requestedMedia.transformedMedia)),
    });
  }

  onViewTransformedMedia(event: MouseEvent, transformedMedia: TransformedMedia) {
    event.preventDefault();
    this.router.navigate(['./audios', transformedMedia.mediaRequestId], {
      state: { transformedMedia },
    });
  }

  onSelectedAudio(selectedAudio: TransformedMedia[]) {
    this.selectedAudioRequests = selectedAudio;
  }

  onDeleteClicked() {
    if (this.selectedAudioRequests.length) {
      this.isDeleting = true;
    }
  }

  onDeleteConfirmed() {
    let deleteRequests: Observable<unknown>[] = [];
    if (this.isAudioRequest) {
      deleteRequests = this.selectedAudioRequests.map((s) => this.audioService.deleteAudioRequests(s.mediaRequestId));
    } else {
      deleteRequests = this.selectedAudioRequests.map((s) =>
        this.audioService.deleteTransformedMedia(s.transformedMediaId)
      );
    }
    forkJoin(deleteRequests).subscribe({
      next: () => (this.isDeleting = false),
      error: () => (this.isDeleting = false),
      complete: () => this.refresh$.next(),
    });
  }

  onDeleteCancelled() {
    this.isDeleting = false;
  }

  onTabChanged() {
    this.selectedAudioRequests = [];
  }

  onClearClicked(event: MouseEvent, row: MediaRequest) {
    this.isAudioRequest = true;
    event.preventDefault();
    this.selectedAudioRequests = [row as TransformedMedia];
    this.isDeleting = true;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'govuk-tag--yellow';
      case 'PROCESSING':
        return 'govuk-tag--yellow';
      case 'FAILED':
        return 'govuk-tag--red';
      case 'COMPLETED':
        return 'govuk-tag--green';
      case 'EXPIRED':
        return 'govuk-tag--grey';
      default:
        return 'govuk-tag--blue';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'READY';
      case 'PROCESSING':
        return 'IN PROGRESS';
      case 'OPEN':
        return 'REQUESTED';
      default:
        return status;
    }
  }
}
