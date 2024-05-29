import { Transcription, TranscriptionStatus } from '@admin-types/transcription';
import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { CourthouseData, DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { DateTime } from 'luxon';
import { Observable, combineLatest, map, shareReplay, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-transcripts',
  standalone: true,
  templateUrl: './user-transcripts.component.html',
  styleUrl: './user-transcripts.component.scss',
  imports: [
    DataTableComponent,
    GovukHeadingComponent,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
    RouterLink,
    LuxonDatePipe,
    TableRowTemplateDirective,
    NgClass,
  ],
})
export class UserTranscriptsComponent implements OnInit {
  transcriptionAdminService = inject(TranscriptionAdminService);
  route = inject(ActivatedRoute);
  courthouseService = inject(CourthouseService);
  fb = inject(FormBuilder);

  form!: FormGroup;

  sixMonthsPrevious = this.calculateSixMonthsPrior();
  transcriptStatusClassMap = transcriptStatusClassMap;

  showAll$!: Observable<boolean>;
  courthouses$: Observable<CourthouseData[]> = this.courthouseService.getCourthouses().pipe(shareReplay(1));
  transcriptionStatuses$: Observable<TranscriptionStatus[]> = this.transcriptionAdminService
    .getTranscriptionStatuses()
    .pipe(shareReplay(1));

  userTranscripts$!: Observable<Transcription[] | null>;

  columns: DatatableColumn[] = [
    { name: 'Request ID', prop: 'id', sortable: true },
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouseId', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Requested on', prop: 'requestedAt', sortable: true },
    { name: 'Status', prop: 'transcriptionStatusId', sortable: true },
    { name: 'Request type', prop: 'isManualTranscription', sortable: true },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      showAll: [false, Validators.required],
    });

    this.showAll$ = this.form.controls.showAll.valueChanges.pipe(startWith(this.form.controls.showAll.value));

    this.userTranscripts$ = combineLatest([this.showAll$, this.courthouses$, this.transcriptionStatuses$]).pipe(
      switchMap(([showAll, courthouses, statuses]) => {
        return (
          this.transcriptionAdminService
            .getTranscriptiptionRequests(
              this.route.snapshot.params.userId,
              showAll ? undefined : this.sixMonthsPrevious
            )
            // Map the results to include the courthouse and status data
            .pipe(map((results) => this.transcriptionAdminService.mapResults(results, courthouses, statuses)))
        );
      })
    );
  }

  private calculateSixMonthsPrior() {
    return DateTime.now().minus({ months: 6 }).toFormat('yyyy-MM-dd');
  }
}
