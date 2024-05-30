import { TranscriptionSearchFormValues } from '@admin-types/transcription';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TabDirective } from '@directives/tab.directive';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { BehaviorSubject, Subject, combineLatest, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { SearchCompletedTranscriptsResultsComponent } from './search-completed-transcripts-results/search-completed-transcripts-results.component';
import { SearchTranscriptsFormComponent } from './search-transcripts-form/search-transcripts-form.component';
import { SearchTranscriptsResultsComponent } from './search-transcripts-results/search-transcripts-results.component';

@Component({
  selector: 'app-transcripts',
  standalone: true,
  templateUrl: './transcripts.component.html',
  styleUrl: './transcripts.component.scss',
  imports: [
    GovukHeadingComponent,
    SearchTranscriptsFormComponent,
    LoadingComponent,
    SearchTranscriptsResultsComponent,
    SearchCompletedTranscriptsResultsComponent,
    AsyncPipe,
    TabsComponent,
    TabDirective,
    ValidationErrorSummaryComponent,
  ],
})
export class TranscriptsComponent {
  transcriptService = inject(TranscriptionAdminService);
  courthouseService = inject(CourthouseService);
  router = inject(Router);
  errors: { fieldId: string; message: string }[] = [];

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
          .pipe(map((results) => this.transcriptService.mapResults(results, courthouses, statuses)))
      );
    }),
    tap((results) => {
      this.stopLoading();
      if (results?.length === 1) {
        //navigate to the transcript details page
        this.router.navigate(['/admin/transcripts', results[0].id]);
      }
    })
  );

  completedResults$ = combineLatest([this.search$, this.isSubmitted$]).pipe(
    tap(() => this.startLoading()),
    switchMap(([values, isSubmitted]) => {
      if (!values || !isSubmitted) {
        return of(null);
      }
      return this.transcriptService.searchCompletedTranscriptions(values);
    }),
    tap(() => this.stopLoading()),
    tap((results) => {
      if (results?.length === 1) {
        // navigate to the transcript document details page
        this.router.navigate(['/admin/transcripts/document', results[0].transcriptionDocumentId]);
      }
    })
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

  clearSearch() {
    this.isSubmitted$.next(false);
    this.search$.next(null);
    this.errors = [];
  }
}
