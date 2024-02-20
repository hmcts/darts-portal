import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@components/common/data-table/data-table.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { TabsComponent } from '@components/common/tabs/tabs.component';
import { ValidationErrorSummaryComponent } from '@components/common/validation-error-summary/validation-error-summary.component';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { DatatableColumn, ErrorSummaryEntry, ReportingRestriction } from '@core-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AppConfigService } from '@services/app-config/app-config.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { MappingService } from '@services/mapping/mapping.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { combineLatest, map, of, shareReplay } from 'rxjs';
import { CaseService } from 'src/app/portal/services/case/case.service';
import { HearingService } from 'src/app/portal/services/hearing/hearing.service';
import { EventsAndAudioComponent } from './events-and-audio/events-and-audio.component';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { RequestPlaybackAudioComponent } from './request-playback-audio/request-playback-audio.component';
import { LoadingComponent } from '@common/loading/loading.component';
import {
  AudioEventRow,
  HearingPageState,
  PostAudioRequest,
  PostAudioResponse,
  TranscriptsRow,
} from '@portal-types/index';
import { AnnotationService } from '@services/annotation/annotation.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { DeleteComponent } from '@common/delete/delete.component';

@Component({
  selector: 'app-hearing',
  standalone: true,
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
  imports: [
    CommonModule,
    HearingFileComponent,
    EventsAndAudioComponent,
    RequestPlaybackAudioComponent,
    OrderConfirmationComponent,
    ReportingRestrictionComponent,
    ForbiddenComponent,
    RouterLink,
    ValidationErrorSummaryComponent,
    LoadingComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    TabsComponent,
    TabDirective,
    DataTableComponent,
    TableRowTemplateDirective,
    JoinPipe,
    LuxonDatePipe,
    DeleteComponent,
  ],
})
export class HearingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  private appConfigService = inject(AppConfigService);
  annotationService = inject(AnnotationService);
  fileDownloadService = inject(FileDownloadService);
  hearingService = inject(HearingService);
  headerService = inject(HeaderService);
  userService = inject(UserService);
  mappingService = inject(MappingService);
  errorMsgService = inject(ErrorMessageService);
  audioTimes: { startTime: DateTime; endTime: DateTime } | null = null;
  private _state: HearingPageState = 'Default';
  public errorSummary: ErrorSummaryEntry[] = [];
  hearingId = this.route.snapshot.params.hearing_id as number;
  caseId = this.route.snapshot.params.caseId;
  userState = this.route.snapshot.data.userState;
  transcripts: TranscriptsRow[] = [];
  rows: AudioEventRow[] = [];
  defaultTab = 'Events and Audio';
  selectedAnnotationsforDeletion: number[] = [];

  public transcripts$ = this.caseService
    .getHearingTranscripts(this.hearingId)
    .pipe(map((transcript) => this.mappingService.mapTranscriptRequestToRows(transcript)));

  transcriptColumns: DatatableColumn[] = [
    { name: 'Type', prop: 'type', sortable: true },
    { name: 'Requested on', prop: 'requestedOn', sortable: true },
    { name: 'Requested by', prop: 'requestedByName', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
    { name: '', prop: '' },
  ];

  annotationColumns: DatatableColumn[] = [
    { name: 'File name', prop: 'fileName', sortable: true },
    { name: 'Format', prop: 'fileType', sortable: true },
    { name: 'Date created', prop: 'uploadedTs', sortable: true },
    { name: 'Comments', prop: 'annotationText', sortable: false },
    { name: '', prop: '' },
    { name: '', prop: '' },
  ];

  statusTagStyleMap: { [key: string]: string } = {
    Requested: 'govuk-tag--blue',
    'Awaiting Authorisation': 'govuk-tag--yellow',
    Approved: 'govuk-tag--turquoise',
    Rejected: 'govuk-tag--red',
    'With Transcriber': 'govuk-tag--purple',
    Complete: 'govuk-tag--green',
    Closed: 'govuk-tag--grey',
  };

  requestId!: number;

  requestObject!: PostAudioRequest;

  case$ = this.caseService.getCase(this.caseId).pipe(shareReplay(1));
  hearing$ = this.caseService.getHearingById(this.caseId, this.hearingId);
  audio$ = this.hearingService.getAudio(this.hearingId);
  // Return null Observable if user is not Admin or Judge
  annotations$ =
    this.userService.isJudge() || this.userService.isAdmin()
      ? this.hearingService.getAnnotations(this.hearingId)
      : of(null);
  events$ = this.hearingService.getEvents(this.hearingId);
  restrictions$ = this.case$.pipe(
    map((c) => this.filterRestrictionsByHearingId(c.reportingRestrictions ?? [], this.hearingId))
  );
  support = this.appConfigService.getAppConfig()?.support;
  error$ = this.errorMsgService.errorMessage$;

  data$ = combineLatest({
    case: this.case$,
    hearing: this.hearing$,
    audios: this.audio$,
    annotations: this.annotations$,
    events: this.events$,
    hearingRestrictions: this.restrictions$,
    error: this.error$,
  });

  // getter for state variable
  public get state() {
    return this._state;
  }

  // overriding state setter to call show/hide navigation
  public set state(value: HearingPageState) {
    if (value === 'Default') {
      this.headerService.showNavigation();
    } else {
      this.headerService.hideNavigation();
    }
    this._state = value;
  }

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParams.tab;

    if (tab === 'Transcripts' || tab === 'Annotations') {
      this.defaultTab = tab;
    }

    const startTime = this.route.snapshot.queryParams.startTime;
    const endTime = this.route.snapshot.queryParams.endTime;

    if (startTime && endTime) {
      this.audioTimes = {
        startTime: DateTime.fromISO(this.route.snapshot.queryParams.startTime),
        endTime: DateTime.fromISO(this.route.snapshot.queryParams.endTime),
      };
    }
  }

  onEventsSelected(audioAndEvents: AudioEventRow[]) {
    const timestamps: number[] = [];

    if (audioAndEvents.length) {
      audioAndEvents.forEach((audioAndEvent: AudioEventRow) => {
        if (audioAndEvent.timestamp) {
          timestamps.push(DateTime.fromISO(audioAndEvent.timestamp).toUTC().toUnixInteger());
        }
        if (audioAndEvent.media_start_timestamp) {
          timestamps.push(DateTime.fromISO(audioAndEvent.media_start_timestamp).toUTC().toUnixInteger());
        }
        if (audioAndEvent.media_end_timestamp) {
          timestamps.push(DateTime.fromISO(audioAndEvent.media_end_timestamp).toUTC().toUnixInteger());
        }
      });

      const startDateTime = DateTime.fromSeconds(Math.min(...timestamps)).toUTC();
      const endDateTime = DateTime.fromSeconds(Math.max(...timestamps)).toUTC();

      this.audioTimes = { startTime: startDateTime, endTime: endDateTime };
    } else {
      this.audioTimes = null;
    }
  }

  onAudioRequest(requestObject: PostAudioRequest) {
    this.requestObject = requestObject;
    this.state = 'OrderSummary';
  }

  onStateChanged(state: HearingPageState) {
    this.state = state;
  }

  onValidationError(errorSummary: ErrorSummaryEntry[]) {
    this.errorSummary = errorSummary;
    if (this.errorSummary.length) {
      setTimeout(() => {
        document.getElementById('error-' + this.errorSummary[0].fieldId)?.focus();
      });
    }
  }

  onBack(event: Event) {
    event.preventDefault();
    this.state = 'Default';
  }

  onOrderConfirm(requestObject: PostAudioRequest) {
    this.hearingService.requestAudio(requestObject).subscribe({
      next: (response: PostAudioResponse) => {
        this.requestId = response.request_id;
        this.state = 'OrderConfirmation';
      },
      error: () => {
        this.state = 'OrderFailure';
      },
    });
  }

  onDownloadClicked(annotationId: number, annotationDocumentId: number, fileName: string) {
    this.annotationService.downloadAnnotationDocument(annotationId, annotationDocumentId).subscribe((blob: Blob) => {
      this.fileDownloadService.saveAs(blob, fileName);
    });
  }

  onDeleteClicked(annotationId: number) {
    this.selectedAnnotationsforDeletion = [annotationId];
  }

  onDeleteConfirmed() {
    this.selectedAnnotationsforDeletion.forEach((annotationId) => {
      this.annotationService.deleteAnnotation(annotationId).subscribe(() => {
        this.data$ = combineLatest({
          case: this.case$,
          hearing: this.hearing$,
          audios: this.audio$,
          annotations: this.annotations$,
          events: this.events$,
          hearingRestrictions: this.restrictions$,
          error: this.error$,
        });
        this.selectedAnnotationsforDeletion = [];
        this.defaultTab = 'Annotations';
      });
    });
  }

  onDeleteCancelled() {
    this.selectedAnnotationsforDeletion = [];
    this.defaultTab = 'Annotations';
  }

  filterRestrictionsByHearingId(restrictions: ReportingRestriction[], hearingId: number): ReportingRestriction[] {
    return restrictions
      .filter((r) => {
        return r.hearing_id == hearingId;
      })
      .map((r) => ({ ...r, event_ts: '' })); // timestamp is not required in hearing screen
  }
}
