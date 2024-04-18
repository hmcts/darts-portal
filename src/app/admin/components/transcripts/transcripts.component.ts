import { Transcription, TranscriptionSearchFormValues, TranscriptionStatus } from '@admin-types/transcription';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { CourthouseData } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { BehaviorSubject, Subject, combineLatest, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { TranscriptionAdminService } from './../../services/transcription-admin/transcription-admin.service';
import { SearchTranscriptsFormComponent } from './search-transcripts-form/search-transcripts-form.component';
import { SearchTranscriptsResultsComponent } from './search-transcripts-results/search-transcripts-results.component';

@Component({
  selector: 'app-transcripts',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    SearchTranscriptsFormComponent,
    LoadingComponent,
    SearchTranscriptsResultsComponent,
    AsyncPipe,
  ],
  templateUrl: './transcripts.component.html',
  styleUrl: './transcripts.component.scss',
})
export class TranscriptsComponent {
  transcriptService = inject(TranscriptionAdminService);
  courthouseService = inject(CourthouseService);

  courthouses$ = this.courthouseService.getCourthouses().pipe(shareReplay(1));
  transcriptionStatuses$ = this.transcriptService.getTranscriptionStatuses().pipe(shareReplay(1));

  search$ = new Subject<TranscriptionSearchFormValues | null>();
  loading$ = new Subject<boolean>();
  isSubmitted$ = new BehaviorSubject<boolean>(false);

  results$ = combineLatest([this.search$, this.isSubmitted$, this.courthouses$, this.transcriptionStatuses$]).pipe(
    tap(() => this.startLoading()),
    switchMap(([values, isSubmitted, courthouses, statuses]) => {
      if (!values || !isSubmitted) {
        return of(null);
      }
      return (
        this.transcriptService
          .search(values)
          // Map the results to include the courthouse and status data
          .pipe(map((results) => this.mapResults(results, courthouses, statuses)))
      );
    }),
    tap(() => this.stopLoading())
  );

  startLoading() {
    this.loading$.next(true);
  }

  stopLoading() {
    this.loading$.next(false);
  }

  onSearch(values: TranscriptionSearchFormValues) {
    if (this.isSubmitted$.value === false) {
      this.isSubmitted$.next(true);
    }
    this.search$.next(values); // Trigger the search
  }

  onClear() {
    this.isSubmitted$.next(false);
    this.search$.next(null); // Clear the search
  }

  mapResults(
    results: Transcription[],
    courthouses: CourthouseData[],
    statuses: TranscriptionStatus[]
  ): Transcription[] {
    return results.map((result) => {
      const courthouse = courthouses.find((c) => c.id === result.courthouse.id);
      const status = statuses.find((s) => s.id === result.status.id);
      return {
        ...result,
        courthouse: {
          id: courthouse?.id,
          displayName: courthouse?.display_name,
          courthouseName: courthouse?.courthouse_name,
        },
        status: {
          id: status?.id,
          type: status?.type,
          displayName: status?.displayName,
        },
      };
    });
  }
}
