import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { Transcription, TranscriptionStatus } from '@admin-types/transcription';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptStatus } from '@portal-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { DateTime } from 'luxon';
import { Observable, combineLatest, map, shareReplay, startWith, switchMap, tap } from 'rxjs';

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
    GovukTagComponent,
  ],
})
export class UserTranscriptsComponent implements OnInit {
  transcriptionAdminService = inject(TranscriptionAdminService);
  route = inject(ActivatedRoute);
  courthouseService = inject(CourthouseService);
  fb = inject(FormBuilder);
  url = inject(Router).url;

  form!: FormGroup;

  sixMonthsPrevious = this.calculateSixMonthsPrior();
  statusColours = transcriptStatusTagColours;

  showAll$!: Observable<boolean>;
  courthouses$: Observable<Courthouse[]> = this.courthouseService.getCourthouses().pipe(
    map((data) => this.courthouseService.mapCourthouseDataToCourthouses(data)),
    shareReplay(1)
  );
  transcriptionStatuses$: Observable<TranscriptionStatus[]> = this.transcriptionAdminService
    .getTranscriptionStatuses()
    .pipe(shareReplay(1));

  userTranscripts$!: Observable<ReturnType<typeof this.mapRows> | null>;
  @Output() transcriptCount = new EventEmitter<number>();

  columns: DatatableColumn[] = [
    { name: 'Request ID', prop: 'id', sortable: true },
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Requested on', prop: 'requestedAt', sortable: true },
    { name: 'Approved on', prop: 'approvedAt', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
    { name: 'Request type', prop: 'isManual', sortable: true },
  ];

  rows: ReturnType<typeof this.mapRows> = [];

  mapRows(results: Transcription[]) {
    return results.map((result) => ({
      id: result.id,
      caseNumber: result.caseNumber,
      courthouse: result.courthouse.displayName,
      hearingDate: result.hearingDate,
      requestedAt: result.requestedAt,
      approvedAt: result.approvedAt,
      status: result.status.displayName as TranscriptStatus,
      isManual: result.isManual,
    }));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      showAll: [false],
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
            .pipe(
              map((results) => this.transcriptionAdminService.mapResults(results, courthouses, statuses)),
              tap((mappedResults) => this.transcriptCount.emit(mappedResults.length))
            )
            .pipe(map((results) => this.mapRows(results)))
        );
      })
    );
  }

  private calculateSixMonthsPrior() {
    return DateTime.now().minus({ months: 6 }).toISO();
  }
}
