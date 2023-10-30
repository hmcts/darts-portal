import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { PlayButtonComponent } from '@common/play-button/play-button.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/case.interface';
import { DatatableColumn, HearingEvent, HearingEventRow, UserAudioRequestRow } from '@darts-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
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
export class AudioViewComponent {
  @ViewChild(AudioPlayerComponent) audioPlayer!: AudioPlayerComponent;
  audioRequestService = inject(AudioRequestService);
  caseService = inject(CaseService);
  hearingService = inject(HearingService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  case$!: Observable<Case>;
  eventRows$!: Observable<HearingEventRow[]>;
  data$: Observable<{ case: Case; rows: HearingEventRow[] }>;

  audioRequest!: UserAudioRequestRow;
  downloadUrl = '';
  fileName = '';
  isDeleting = false;
  requestId: number;
  isAudioPlaying = false;
  isAudioTouched = false;
  currentPlayTime = 0;
  mediaId: number;

  columns: DatatableColumn[] = [
    { name: '', prop: '' },
    { name: 'Event type', prop: 'eventType', sortable: true },
    { name: 'Event time', prop: 'eventTime', sortable: true },
    { name: 'Audio file time', prop: 'audioTime', sortable: true },
  ];

  constructor() {
    this.audioRequest = this.audioRequestService.audioRequestView;

    if (!this.audioRequest) {
      this.router.navigate(['/audios']);
    }

    // this.mediaId = this.audioRequest.mediaId;
    this.mediaId = 41; // Hardcoded for now until we can get the mediaId from the audioRequest
    this.requestId = this.audioRequest.requestId;
    const isUnread = !this.audioRequest.lastAccessed;

    //Send request to update last accessed time of audio
    this.audioRequestService.patchAudioRequestLastAccess(this.requestId, isUnread).subscribe();

    this.case$ = this.caseService.getCase(this.audioRequest.caseId);
    this.eventRows$ = this.hearingService.getEvents(this.audioRequest.hearingId).pipe(
      map((events) => this.filterEvents(events)), // Remove events outside of audio start and end time
      map((events) => this.mapEventRows(events)) // Map hearing events to rows for data table
    );

    this.data$ = combineLatest({ case: this.case$, rows: this.eventRows$ });

    this.downloadUrl = this.audioRequestService.getDownloadUrl(this.requestId);
    this.fileName = `${this.audioRequest.output_filename}.${this.audioRequest.output_format}`;
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
    this.audioRequestService.deleteAudioRequests(this.requestId).subscribe({
      next: () => {
        this.router.navigate(['/audios']);
        return;
      },
      error: () => (this.isDeleting = false),
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
}
