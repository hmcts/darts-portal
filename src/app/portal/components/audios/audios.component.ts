import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { DatatableColumn, ErrorSummaryEntry, FormErrorMessages, TagColour } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { UnreadIconDirective } from '@directives/unread-icon.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { MediaRequest, RequestedMedia, TransformedMedia } from '@portal-types/index';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { HeaderService } from '@services/header/header.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { BehaviorSubject, combineLatest, forkJoin, map, Observable, shareReplay, switchMap, tap } from 'rxjs';

const MAX_DOWNLOAD_LIMIT = 20;
const audiosErrorMessages: FormErrorMessages = {
  bulkDownload: {
    required: 'You must select at least one audio to download',
    maxlength: `There is a maximum of ${MAX_DOWNLOAD_LIMIT} files that can be selected for bulk download in one go`,
    error: 'There has been an error downloading audio',
  },
  bulkDelete: {
    required: 'You must select at least one audio to delete',
  },
};
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
    GovukHeadingComponent,
    GovukTagComponent,
    ValidationErrorSummaryComponent,
  ],
})
export class AudiosComponent {
  readonly tabNames = {
    currentAudio: 'Current',
    expiredAudio: 'Expired',
  } as const;

  headerService = inject(HeaderService);
  audioService = inject(AudioRequestService);
  downloadService = inject(FileDownloadService);
  scrollService = inject(ScrollService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  title = inject(Title);

  private refresh$ = new BehaviorSubject<void>(undefined);

  selectedAudioRequests: TransformedMedia[] = [];

  errors = signal<ErrorSummaryEntry[]>([]);
  isDeleting = signal(false);
  isAudioRequest = false;
  isDownloading = false;

  eff = effect(() => {
    if (this.isDeleting()) {
      this.title.setTitle('DARTS Delete Audio Items');
    } else {
      this.title.setTitle('DARTS Your Audio');
    }
  });

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
    { name: 'Last accessed', prop: 'lastAccessedTs', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
  ];

  readyColumns = [
    { name: 'Unread notification column', prop: '', hidden: true },
    ...this.columns,
    { name: 'View audio links', prop: '', hidden: true },
  ]; //Empty columns for unread icon and view link

  //columns, replace last accessed with expiry date
  expiredColumns = this.columns.map((column) =>
    column.prop === 'lastAccessedTs'
      ? { name: 'Expiry date', prop: 'transformedMediaExpiryTs', sortable: true }
      : column
  );

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
      completedRows: this.audioRequests$.pipe(
        map((requestedMedia) => requestedMedia.transformedMedia),
        map((medias) =>
          medias.map((media) => ({
            ...media,
            checkboxLabel: `Select delete audio checkbox for case ${media.caseNumber}`,
          }))
        )
      ),
      expiredRows: this.expiredAudioRequests$.pipe(
        map((requestedMedia) => requestedMedia.transformedMedia),
        map((medias) =>
          medias.map((media) => ({
            ...media,
            checkboxLabel: `Select delete audio checkbox for case ${media.caseNumber}`,
          }))
        )
      ),
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

  private clearSelectedAudio() {
    this.selectedAudioRequests = [];
  }

  onDeleteClicked() {
    this.setErrorSummary('bulkDelete');

    if (this.selectedAudioRequests.length && this.errors().length === 0) {
      this.isDeleting.set(true);
    }
  }

  private setErrorSummary(type: 'bulkDownload' | 'bulkDelete'): void {
    this.errors.set([]);
    const errors: ErrorSummaryEntry[] = [];

    if (type === 'bulkDownload' && this.selectedAudioRequests.length === 0) {
      errors.push({ fieldId: 'bulkDownload', message: audiosErrorMessages.bulkDownload.required });
    }
    if (type === 'bulkDownload' && this.selectedAudioRequests.length > MAX_DOWNLOAD_LIMIT) {
      errors.push({ fieldId: 'bulkDownload', message: audiosErrorMessages.bulkDownload.maxlength });
    }
    if (type === 'bulkDelete' && this.selectedAudioRequests.length === 0) {
      errors.push({ fieldId: 'bulkDelete', message: audiosErrorMessages.bulkDelete.required });
    }

    if (errors.length) {
      this.errors.set(errors);
      this.scrollService.scrollTo('#error-summary');
    }
  }

  onDownloadConfirmed() {
    this.setErrorSummary('bulkDownload');

    if (this.selectedAudioRequests.length && this.errors().length === 0) {
      this.isDownloading = true;

      //Downloads in parallel
      const downloadRequests = this.selectedAudioRequests.map((audio) =>
        this.audioService.downloadAudio(audio.transformedMediaId, audio.requestType).pipe(
          tap((blob: Blob) => {
            this.downloadService.saveAs(blob, audio.transformedMediaFilename);
          })
        )
      );

      forkJoin(downloadRequests).subscribe({
        complete: () => {
          this.clearSelectedAudio();
          this.isDownloading = false;
        },
        error: () => {
          this.errors.set([{ fieldId: 'bulkDownload', message: audiosErrorMessages.bulkDownload.error }]);
          this.isDownloading = false;
        },
      });
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
      next: () => this.isDeleting.set(false),
      error: () => this.isDeleting.set(false),
      complete: () => {
        this.clearSelectedAudio();
        this.refresh$.next();
      },
    });
  }

  onDeleteCancelled() {
    this.clearSelectedAudio();
    this.isDeleting.set(false);
  }

  onTabChanged() {
    this.clearSelectedAudio();
  }

  onClearClicked(event: MouseEvent, row: MediaRequest) {
    this.isAudioRequest = true;
    event.preventDefault();
    this.selectedAudioRequests = [row as TransformedMedia];
    this.isDeleting.set(true);
  }

  getStatusColour(status: string): TagColour {
    switch (status) {
      case 'OPEN':
        return 'yellow';
      case 'PROCESSING':
        return 'yellow';
      case 'FAILED':
        return 'red';
      case 'COMPLETED':
        return 'green';
      case 'EXPIRED':
        return 'grey';
      default:
        return 'blue';
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
