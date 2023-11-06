import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { PlayButtonComponent } from '@common/play-button/play-button.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/case.interface';
import { ErrorMessage } from '@darts-types/error-message.interface';
import { DatatableColumn, HearingEvent, HearingEventRow, UserAudioRequestRow } from '@darts-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HearingService } from '@services/hearing/hearing.service';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable } from 'rxjs';
import { AudioDeleteComponent } from '../audio-delete/audio-delete.component';

@Component({
  selector: 'app-audio-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReportingRestrictionComponent,
    AudioDeleteComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    DataTableComponent,
    TableRowTemplateDirective,
    AudioPlayerComponent,
    PlayButtonComponent,
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

  case$!: Observable<Case>;
  eventRows$!: Observable<HearingEventRow[]>;
  data$: Observable<{ case: Case; rows: HearingEventRow[]; error: ErrorMessage | null }> | undefined;

  audioRequest!: UserAudioRequestRow;
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
    'You do not have permission to view this file',
    `Email ${this.support?.emailAddress} to request access`,
  ];

  constructor(private errorMsgService: ErrorMessageService) {
    this.audioRequest = this.audioRequestService.audioRequestView;

    if (!this.audioRequest) {
      this.router.navigate(['/audios']);
    } else {
      this.requestId = this.audioRequest.requestId;
      const isUnread = !this.audioRequest.lastAccessed;

      //Send request to update last accessed time of audio
      this.audioRequestService.patchAudioRequestLastAccess(this.requestId, isUnread).subscribe();

      this.case$ = this.caseService.getCase(this.audioRequest.caseId);
      this.fileName = `${this.audioRequest.caseNumber}.zip`;

      this.audioSource = `/api/audio-requests/playback?media_request_id=${this.requestId}`;

      this.eventRows$ = this.hearingService.getEvents(this.audioRequest.hearingId).pipe(
        map((events) => this.filterEvents(events)), // Remove events outside of audio start and end time
        map((events) => this.mapEventRows(events)) // Map hearing events to rows for data table
      );

      this.data$ = combineLatest({ case: this.case$, rows: this.eventRows$, error: this.error$ });

      this.fileName = `${this.audioRequest?.output_filename}.${this.audioRequest?.output_format}`;
    }
  }

  filterEvents(events: HearingEvent[]): HearingEvent[] {
    return events.filter(
      (event) =>
        DateTime.fromISO(event.timestamp) >= DateTime.fromISO(this.audioRequest.startTime) &&
        DateTime.fromISO(event.timestamp) <= DateTime.fromISO(this.audioRequest.endTime)
    );
  }

  mapEventRows(events: HearingEvent[]): HearingEventRow[] {
    return events.map((event, index) => {
      const eventStartTime = DateTime.fromISO(event.timestamp);
      // as there is no event end timestamp, use the next event's start time, if there is no next event, use the audio file's end time
      const eventEndTime = DateTime.fromISO(events[index + 1]?.timestamp || this.audioRequest.endTime);
      const audioStartTime = DateTime.fromISO(this.audioRequest.startTime);

      const eventAudioStartTime = eventStartTime.diff(audioStartTime, ['hours', 'minutes', 'seconds']);
      const eventAudioEndTime = eventEndTime.diff(audioStartTime, ['hours', 'minutes', 'seconds']);

      return {
        eventType: `${event.name} - ${event.text}`,
        eventTime: event.timestamp,
        audioTime: eventAudioStartTime.toFormat('hh:mm:ss'),
        startTime: eventAudioStartTime.as('seconds'), // used to calculate if row is playing
        endTime: eventAudioEndTime.as('seconds'), // used to calculate if row is playing
      };
    });
  }

  onDeleteConfirmed() {
    this.requestId &&
      this.audioRequestService.deleteAudioRequests(this.requestId).subscribe({
        next: () => {
          this.router.navigate(['/audios']);
          return;
        },
        error: () => (this.isDeleting = false),
      });
  }

  onDownloadClicked() {
    this.audioRequestService.downloadAudio(this.route.snapshot.params.requestId).subscribe({
      next: (blob: Blob) => {
        this.saveAs(blob, `${this.audioRequest?.caseNumber.toString()}.zip`);
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

  onPlayTimeChaged(playTime: number) {
    this.currentPlayTime = playTime;
    this.isAudioTouched = true;
  }

  isRowPlaying(row: HearingEventRow): boolean {
    return this.currentPlayTime > row.startTime && this.currentPlayTime < row.endTime;
  }

  private saveAs(blob: Blob, fileName: string) {
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(downloadLink);
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }
}
