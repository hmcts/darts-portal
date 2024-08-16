import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DataTableComponent } from '@components/common/data-table/data-table.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@components/common/validation-error-summary/validation-error-summary.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AudioEventRow, HearingAudio, TranscriptionRequest } from '@portal-types/index';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { HearingService } from '@services/hearing/hearing.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { RequestTimesComponent } from './request-times/request-times.component';
import { RequestTranscriptConfirmationComponent } from './request-transcript-confirmation/request-transcript-confirmation.component';
import { RequestTranscriptExistsComponent } from './request-transcript-exists/request-transcript-exists.component';
import { RequestTranscriptSuccessComponent } from './request-transcript-success/request-transcript-success.component';

enum TranscriptionType {
  COURT_LOG = '5',
  SPECIFIED_TIMES = '9',
}
@Component({
  selector: 'app-request-transcript',
  standalone: true,
  imports: [
    CommonModule,
    ReportingRestrictionComponent,
    DataTableComponent,
    JoinPipe,
    LoadingComponent,
    TableRowTemplateDirective,
    RouterLink,
    ReactiveFormsModule,
    ValidationErrorSummaryComponent,
    RequestTimesComponent,
    RequestTranscriptConfirmationComponent,
    RequestTranscriptSuccessComponent,
    RequestTranscriptExistsComponent,
    LuxonDatePipe,
    GovukHeadingComponent,
  ],
  templateUrl: './request-transcript.component.html',
  styleUrls: ['./request-transcript.component.scss'],
})
export class RequestTranscriptComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  caseService = inject(CaseService);
  hearingService = inject(HearingService);
  headerService = inject(HeaderService);
  transcriptionService = inject(TranscriptionService);
  errorMsgService = inject(ErrorMessageService);
  scrollService = inject(ScrollService);

  hearingId = this.route.snapshot.params.hearingId;
  caseId = this.route.snapshot.params.caseId;

  urgencyFormControl = new FormControl('', [Validators.required]);
  transcriptionTypeFormControl = new FormControl('', [Validators.required]);
  audioTimes?: { startTime: DateTime | null; endTime: DateTime | null };

  validationErrors: { fieldId: string; message: string }[] = [];
  isSubmitted = false;

  error$ = this.errorMsgService.errorMessage$;
  case$ = this.caseService.getCase(this.caseId);
  hearing$ = this.caseService
    .getHearingById(this.caseId, this.hearingId)
    .pipe(tap((hearing) => hearing ?? this.router.navigate(['/page-not-found'])));
  urgencies$ = this.transcriptionService.getUrgencies();
  transcriptionTypes$ = this.transcriptionService.getTranscriptionTypes();
  events$ = this.hearingService.getEvents(this.hearingId);
  transcriptRequestRows$: Observable<AudioEventRow[]> = this.hearingService
    .getAudio(this.hearingId)
    .pipe(map((x) => this.mapEventsAndAudioToTable(x)));

  data$ = combineLatest({
    case: this.case$,
    hearing: this.hearing$,
    audioRows: this.transcriptRequestRows$,
    transcriptionTypes: this.transcriptionTypes$,
    urgencies: this.urgencies$,
    events: this.events$,
    error: this.error$,
  });

  transcriptRequestColumns: DatatableColumn[] = [
    { name: 'Start Time', prop: 'media_start_timestamp', sortable: true },
    { name: 'End Time', prop: 'media_end_timestamp', sortable: true },
    { name: 'Title', prop: '', hidden: true },
  ];

  step = signal(1);
  transcriptRequestId!: number;

  constructor() {
    effect(() => {
      // Scroll to top when step changes
      if (this.step()) {
        this.scrollService.scrollToTop();
      }
    });
  }

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }

  onNextStep() {
    this.isSubmitted = true;

    this.validationErrors = [];

    if (this.urgencyFormControl.valid && this.transcriptionTypeFormControl.valid) {
      this.validationErrors = [];
    } else {
      if (this.transcriptionTypeFormControl.invalid) {
        this.validationErrors.push({
          fieldId: 'transcription-type',
          message: 'Please select a transcription type',
        });
      }
      if (this.urgencyFormControl.invalid) {
        this.validationErrors.push({
          fieldId: 'urgency',
          message: 'Please select an urgency',
        });
      }
      this.scrollService.scrollTo('app-validation-error-summary');
      return;
    }

    if (this.isSpecifiedTimesOrCourtLog()) {
      this.step.set(2);
    } else {
      this.step.set(3);
    }
  }

  isSpecifiedTimesOrCourtLog() {
    return (
      this.transcriptionTypeFormControl.value == TranscriptionType.COURT_LOG ||
      this.transcriptionTypeFormControl.value == TranscriptionType.SPECIFIED_TIMES
    );
  }

  getValidationMessage(fieldId: string): string {
    return this.validationErrors.find((x) => x.fieldId === fieldId)?.message ?? '';
  }

  getUniqueErrorSummary() {
    return this.validationErrors.filter((error, index, self) => {
      return index === self.findIndex((e) => e.message === error.message);
    });
  }

  mapEventsAndAudioToTable(audio: HearingAudio[]): AudioEventRow[] {
    return audio.map((audio) => ({
      ...audio,
      name: 'Audio Recording',
      type: 'audio',
    }));
  }

  onRequestTimeContinue({ startTime, endTime }: { startTime: DateTime | null; endTime: DateTime | null }) {
    this.audioTimes = { startTime, endTime };
    this.step.set(3);
  }

  onRequestTimeCancel() {
    this.audioTimes = undefined;
    this.validationErrors = [];
    this.step.set(1);
  }

  onConfirmationCancel() {
    if (this.isSpecifiedTimesOrCourtLog()) {
      this.step.set(2);
    } else {
      this.step.set(1);
    }
  }

  onConfirm(moreDetail: string) {
    const transcriptionRequest: TranscriptionRequest = {
      case_id: this.caseId,
      hearing_id: this.hearingId,
      transcription_type_id: this.transcriptionTypeFormControl.value ? +this.transcriptionTypeFormControl.value : 0,
      transcription_urgency_id: this.urgencyFormControl.value ? +this.urgencyFormControl.value : 0,
      comment: moreDetail,
      start_date_time: this.audioTimes?.startTime ? this.audioTimes?.startTime?.toISO()?.split('.')[0] + 'Z' : '',
      end_date_time: this.audioTimes?.startTime ? this.audioTimes?.endTime?.toISO()?.split('.')[0] + 'Z' : '',
    };

    this.transcriptionService
      .postTranscriptionRequest(transcriptionRequest)
      .subscribe((response: { transcription_id: number }) => {
        this.transcriptRequestId = response.transcription_id;
        this.step.set(4);
      });
  }
}
