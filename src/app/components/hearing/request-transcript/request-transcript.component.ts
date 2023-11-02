import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { AudioEventRow, DatatableColumn, HearingAudio } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { JoinPipe } from '@pipes/join';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { HearingService } from '@services/hearing/hearing.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { combineLatest, map, merge, Observable } from 'rxjs';
import { ValidationErrorSummaryComponent } from './../../common/validation-error-summary/validation-error-summary.component';
import { RequestTimesComponent } from './request-times/request-times.component';

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
  ],
  templateUrl: './request-transcript.component.html',
  styleUrls: ['./request-transcript.component.scss'],
})
export class RequestTranscriptComponent implements OnInit {
  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  route = inject(ActivatedRoute);
  caseService = inject(CaseService);
  hearingService = inject(HearingService);
  headerService = inject(HeaderService);
  transcriptionService = inject(TranscriptionService);

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;

  urgencyFormControl = new FormControl('', [Validators.required]);
  transcriptionTypeFormControl = new FormControl('', [Validators.required]);
  formChanges$ = merge(this.urgencyFormControl.valueChanges, this.transcriptionTypeFormControl.valueChanges);

  validationErrors: { fieldId: string; message: string }[] = [];
  isSubmitted = false;

  case$ = this.caseService.getCase(this.caseId);
  hearing$ = this.caseService.getHearingById(this.caseId, this.hearingId);
  urgencies$ = this.transcriptionService.getUrgencies();
  transcriptionTypes$ = this.transcriptionService.getTranscriptionTypes();
  transcriptRequestRows$: Observable<AudioEventRow[]> = this.hearingService
    .getAudio(this.hearingId)
    .pipe(map((x) => this.mapEventsAndAudioToTable(x)));

  data$ = combineLatest({
    case: this.case$,
    hearing: this.hearing$,
    audioRows: this.transcriptRequestRows$,
    transcriptionTypes: this.transcriptionTypes$,
    urgencies: this.urgencies$,
  });

  transcriptRequestColumns: DatatableColumn[] = [
    { name: 'Start Time', prop: 'media_start_timestamp', sortable: true },
    { name: 'End Time', prop: 'media_end_timestamp', sortable: true },
    { name: '', prop: 'name' },
  ];

  step = 1;

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
      return;
    }

    if (this.transcriptionTypeFormControl.value == '5' || this.transcriptionTypeFormControl.value == '9') {
      this.step = 2;
    } else {
      this.step = 3;
    }
  }

  getValidationMessage(fieldId: string): string {
    return this.validationErrors.find((x) => x.fieldId === fieldId)?.message ?? '';
  }

  mapEventsAndAudioToTable(audio: HearingAudio[]): AudioEventRow[] {
    return audio.map((audio) => ({
      ...audio,
      name: 'Audio Recording',
    }));
  }
}
