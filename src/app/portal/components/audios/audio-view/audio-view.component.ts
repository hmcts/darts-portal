import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { PlayButtonComponent } from '@common/play-button/play-button.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorMessage } from '@core-types/error/error-message.interface';
import { DatatableColumn } from '@core-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Case } from '@portal-types/case/case.type';
import { HearingEvent, HearingEventRow, TransformedMedia } from '@portal-types/index';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { HearingService } from '@services/hearing/hearing.service';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-audio-view',
  standalone: true,
  imports: [
    CommonModule,
    ReportingRestrictionComponent,
    DeleteComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    DataTableComponent,
    TableRowTemplateDirective,
    AudioPlayerComponent,
    PlayButtonComponent,
    ValidationErrorSummaryComponent,
    LuxonDatePipe,
    GovukHeadingComponent,
  ],
  templateUrl: './audio-view.component.html',
  styleUrls: ['./audio-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioViewComponent implements OnDestroy {
  @ViewChild(AudioPlayerComponent) audioPlayer!: AudioPlayerComponent;

  appConfigService = inject(AppConfigService);
  audioRequestService = inject(AudioRequestService);
  caseService = inject(CaseService);
  hearingService = inject(HearingService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  downloadService = inject(FileDownloadService);

  case$!: Observable<Case>;
  eventRows$!: Observable<HearingEventRow[]>;
  data$: Observable<{ case: Case; rows: HearingEventRow[]; error: ErrorMessage | null }> | undefined;

  isAudioAvailable$!: Observable<number>;
  transformedMedia!: TransformedMedia;
  downloadUrl = '';
  audioSource = '';
  fileName = '';
  isDeleting = false;
  requestId: number | undefined;
  isAudioPlaying = false;
  isAudioTouched = false;
  currentPlayTime = 0;

  support = this.appConfigService.getAppConfig()?.support;

  columns: DatatableColumn[] = [
    { name: '', prop: '' },
    { name: 'Event type', prop: 'eventType', sortable: true },
    { name: 'Event time', prop: 'eventTime', sortable: true },
    { name: 'Audio file time', prop: 'audioTime', sortable: true },
  ];

  error$ = this.errorMsgService.errorMessage$;

  permissionErrors = [
    { fieldId: '', message: 'You do not have permission to view this file' },
    { fieldId: '', message: `Email ${this.support?.emailAddress} to request access` },
  ];

  constructor(private errorMsgService: ErrorMessageService) {
    this.transformedMedia = this.router.getCurrentNavigation()?.extras?.state?.transformedMedia;

    if (this.isInvalidTransformedMedia(this.transformedMedia)) {
      this.router.navigate(['/audios']);
    } else {
      this.requestId = this.transformedMedia.mediaRequestId;
      const isUnread = !this.transformedMedia.lastAccessedTs;
      const transformedMediaId = this.transformedMedia.transformedMediaId;

      //Send request to update last accessed time of audio
      this.audioRequestService.patchAudioRequestLastAccess(transformedMediaId, isUnread).subscribe();

      this.case$ = this.caseService.getCase(this.transformedMedia.caseId);

      if (this.transformedMedia.requestType === 'PLAYBACK') {
        const url = `/api/audio-requests/playback?transformed_media_id=${this.transformedMedia.transformedMediaId}`;
        this.isAudioAvailable$ = this.audioRequestService.isAudioPlaybackAvailable(url);
        this.audioSource = url;
      }

      this.eventRows$ = this.hearingService.getEvents(this.transformedMedia.hearingId).pipe(
        map((events) => this.filterEvents(events)), // Remove events outside of audio start and end time
        map((events) => this.mapEventRows(events)) // Map hearing events to rows for data table
      );

      this.data$ = combineLatest({ case: this.case$, rows: this.eventRows$, error: this.error$ });
    }
  }

  filterEvents(events: HearingEvent[]): HearingEvent[] {
    return events.filter(
      (event) =>
        DateTime.fromISO(event.timestamp) >= this.transformedMedia.startTime &&
        DateTime.fromISO(event.timestamp) <= this.transformedMedia.endTime
    );
  }

  mapEventRows(events: HearingEvent[]): HearingEventRow[] {
    return events.map((event, index) => {
      const eventStartTime = DateTime.fromISO(event.timestamp);
      // as there is no event end timestamp, use the next event's start time, if there is no next event, use the audio file's end time
      const eventEndTime = events[index + 1]?.timestamp
        ? DateTime.fromISO(events[index + 1]?.timestamp)
        : this.transformedMedia.endTime;
      const audioStartTime = this.transformedMedia.startTime;

      const eventAudioStartTime = eventStartTime.diff(audioStartTime, ['hours', 'minutes', 'seconds']);
      const eventAudioEndTime = eventEndTime.diff(audioStartTime, ['hours', 'minutes', 'seconds']);

      return {
        eventType: event.text ? `${event.name} - ${event.text}` : event.name,
        eventTime: event.timestamp,
        audioTime: eventAudioStartTime.toFormat('hh:mm:ss'),
        startTime: eventAudioStartTime.as('seconds'), // used to calculate if row is playing
        endTime: eventAudioEndTime.as('seconds'), // used to calculate if row is playing
      };
    });
  }

  onDeleteConfirmed() {
    if (this.transformedMedia.transformedMediaId) {
      this.audioRequestService.deleteTransformedMedia(this.transformedMedia.transformedMediaId).subscribe({
        next: () => {
          this.router.navigate(['/audios']);
        },
        error: () => (this.isDeleting = false),
      });
    }
  }

  onDownloadClicked() {
    this.audioRequestService
      .downloadAudio(this.transformedMedia.transformedMediaId, this.transformedMedia.requestType)
      .subscribe({
        next: (blob: Blob) => {
          this.downloadService.saveAs(blob, this.transformedMedia.transformedMediaFilename);
        },
      });
  }

  onSkip(seconds: number, isAlreadyPlaying: boolean) {
    if (isAlreadyPlaying) {
      this.audioPlayer.setPlayTime(this.currentPlayTime, !this.isAudioPlaying);
    } else {
      this.audioPlayer.setPlayTime(seconds, true);
    }
  }

  onPlayTimeChanged(playTime: number) {
    this.currentPlayTime = playTime;
    this.isAudioTouched = true;
  }

  isRowPlaying(row: HearingEventRow): boolean {
    return this.currentPlayTime > row.startTime && this.currentPlayTime < row.endTime;
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }

  isInvalidTransformedMedia(transformedMedia: TransformedMedia) {
    return (
      !transformedMedia ||
      !transformedMedia.startTime.toISO ||
      !transformedMedia.endTime.toISO ||
      !transformedMedia.hearingDate.toISO
    );
  }
}
