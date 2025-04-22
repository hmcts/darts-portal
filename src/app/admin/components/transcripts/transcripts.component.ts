import { TranscriptionSearchFormValues } from '@admin-types/transcription';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TabDirective } from '@directives/tab.directive';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { ScrollService } from '@services/scroll/scroll.service';
import {
  defaultFormValues,
  TranscriptionAdminService,
} from '@services/transcription-admin/transcription-admin.service';
import { combineLatest, map, of, shareReplay, Subject, switchMap, tap } from 'rxjs';
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
  scrollService = inject(ScrollService);
  activeTabService = inject(ActiveTabService);

  router = inject(Router);
  errors: { fieldId: string; message: string }[] = [];

  courthouses$ = this.courthouseService.getCourthouses().pipe(
    map((data) => this.courthouseService.mapCourthouseDataToCourthouses(data)),
    shareReplay(1)
  );
  transcriptionStatuses$ = this.transcriptService.getTranscriptionStatuses().pipe(shareReplay(1));

  search$ = new Subject<TranscriptionSearchFormValues | null>();
  isSubmitted$ = this.transcriptService.hasSearchFormBeenSubmitted$;

  loadingResults = signal(false);
  loadingCompletedResults = signal(false);

  readonly TRANSCRIPT_REQUESTS_TAB = 'Transcript requests';
  readonly COMPLETED_TRANSCRIPTS_TAB = 'Transcript documents';

  tab = computed(() => this.activeTabService.activeTabs()['search-transcripts'] ?? this.TRANSCRIPT_REQUESTS_TAB);

  results$ = combineLatest([this.search$, this.isSubmitted$, this.courthouses$, this.transcriptionStatuses$]).pipe(
    tap(() => {
      this.loadingResults.set(true);
    }),
    switchMap(([values, isSubmitted, courthouses, statuses]) => {
      if (!values || !isSubmitted || this.tab() === this.COMPLETED_TRANSCRIPTS_TAB) {
        return of(null);
      }
      return (
        this.transcriptService
          .search(values)
          // Map the results to include the courthouse and status data
          .pipe(map((results) => this.transcriptService.mapResults(results, courthouses, statuses)))
      );
    }),
    takeUntilDestroyed(),
    tap((results) => {
      this.loadingResults.set(false);
      if (results?.length === 1) {
        //navigate to the transcript details page
        this.router.navigate(['/admin/transcripts', results[0].id]);
      }
    })
  );

  completedResults$ = combineLatest([this.search$, this.isSubmitted$]).pipe(
    tap(() => {
      this.loadingCompletedResults.set(true);
    }),
    switchMap(([values, isSubmitted]) => {
      if (!values || !isSubmitted || this.tab() === this.TRANSCRIPT_REQUESTS_TAB) {
        return of(null);
      }
      return this.transcriptService.searchCompletedTranscriptions(values);
    }),
    takeUntilDestroyed(),
    tap((results) => {
      this.loadingCompletedResults.set(false);
      if (results?.length === 1) {
        // navigate to the transcript document details page
        this.router.navigate(['/admin/transcripts/document', results[0].transcriptionDocumentId]);
      }
    })
  );

  constructor() {
    this.results$.subscribe((results) => results && this.transcriptService.searchResults.set(results));
    this.completedResults$.subscribe(
      (results) => results && this.transcriptService.completedSearchResults.set(results)
    );
  }

  onSearch(values: TranscriptionSearchFormValues) {
    if (this.isSubmitted$.getValue() === false) {
      this.isSubmitted$.next(true);
    }
    this.transcriptService.searchFormValues.set(values); // save form state
    this.search$.next(values); // Trigger the search
    this.scrollService.scrollTo('.results');
  }

  clearSearch() {
    this.transcriptService.searchFormValues.set(defaultFormValues);
    this.transcriptService.searchResults.set(null);
    this.transcriptService.isAdvancedSearch.set(false);
    this.transcriptService.completedSearchResults.set(null);
    this.transcriptService.hasSearchFormBeenSubmitted$.next(false);
    this.search$.next(null);
    this.errors = [];
  }

  onTabChanged(tab: string) {
    this.clearSearch();
    this.activeTabService.setActiveTab('search-transcripts', tab);
  }

  onErrors(errors: { fieldId: string; message: string }[]) {
    this.errors = errors;
    this.scrollService.scrollTo('app-validation-error-summary');
  }
}
