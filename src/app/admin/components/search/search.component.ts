import { AdminEventSearchResult } from '@admin-types/search/admin-event-search-result';
import { AdminHearingSearchResult } from '@admin-types/search/admin-hearing-search-result';
import { AdminMediaSearchResult } from '@admin-types/search/admin-media-search-result';
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTabsComponent } from '@common/govuk-tabs/govuk-tabs.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { CaseSearchResultsComponent } from '@components/search/case-search-results/case-search-results.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { CaseSearchResult } from '@portal-types/index';
import { AdminSearchService } from '@services/admin-search/admin-search.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { catchError, finalize, map, of } from 'rxjs';
import { AudioSearchResultsComponent } from './audio-search-results/audio-search-results.component';
import { EventSearchResultsComponent } from './event-search-results/event-search-results.component';
import { HearingSearchResultsComponent } from './hearing-search-results/hearing-search-results.component';
import { AdminSearchFormValues, SearchFormComponent } from './search-form/search-form.component';

type SearchResultsTab = 'Cases' | 'Hearings' | 'Events' | 'Audio';
@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  imports: [
    GovukHeadingComponent,
    SearchFormComponent,
    GovukTabsComponent,
    TabDirective,
    LoadingComponent,
    JsonPipe,
    ValidationErrorSummaryComponent,
    CaseSearchResultsComponent,
    HearingSearchResultsComponent,
    EventSearchResultsComponent,
    AudioSearchResultsComponent,
  ],
})
export class SearchComponent {
  courthouseService = inject(CourthouseService);
  searchService = inject(AdminSearchService);

  tab = signal<SearchResultsTab>('Cases');
  searchError = signal<string | null>(null);
  isLoading = signal<boolean>(true);
  isSubmitted = signal<boolean>(false);
  formValidationErrors = signal<ErrorSummaryEntry[]>([]);
  lastSearchFormValues = signal<AdminSearchFormValues>({
    courthouses: [],
    caseId: '',
    courtroom: '',
    hearingDate: {
      type: '',
      specific: '',
      from: '',
      to: '',
    },
    resultsFor: 'Cases',
  });

  courthouses$ = this.courthouseService.getCourthouses().pipe(
    map((data) => this.courthouseService.mapCourthouseDataToCourthouses(data)),
    finalize(() => this.isLoading.set(false))
  );

  courthouses = toSignal(this.courthouses$, {
    initialValue: [],
  });

  cases = signal<CaseSearchResult[]>([]);
  hearings = signal<AdminHearingSearchResult[]>([]);
  events = signal<AdminEventSearchResult[]>([]);
  audio = signal<AdminMediaSearchResult[]>([]);

  onSearch(searchFormValues: AdminSearchFormValues) {
    const resultsFor = searchFormValues.resultsFor as SearchResultsTab;
    this.tab.set(resultsFor);
    this.lastSearchFormValues.set(searchFormValues);
    this.isSubmitted.set(true);
    this.isLoading.set(true);
    this.searchError.set(null);

    switch (resultsFor) {
      case 'Cases':
        this.searchCases(searchFormValues);
        break;
      case 'Hearings':
        this.searchHearings(searchFormValues);
        break;
      case 'Events':
        this.searchEvents(searchFormValues);
        break;
      case 'Audio':
        this.searchAudio(searchFormValues);
        break;
      default:
        this.isLoading.set(false);
    }
  }

  searchCases(searchFormValues: AdminSearchFormValues) {
    this.cases.set([]);
    this.searchService
      .getCases(searchFormValues)
      .pipe(
        catchError(() => this.handleError()),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((data) => this.cases.set(data));
  }

  searchEvents(searchFormValues: AdminSearchFormValues) {
    this.events.set([]);
    this.searchService
      .getEvents(searchFormValues)
      .pipe(
        catchError(() => this.handleError()),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((data) => this.events.set(data));
  }

  searchHearings(searchFormValues: AdminSearchFormValues) {
    this.hearings.set([]);
    this.searchService
      .getHearings(searchFormValues)
      .pipe(
        catchError(() => this.handleError()),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((data) => this.hearings.set(data));
  }

  searchAudio(searchFormValues: AdminSearchFormValues) {
    this.audio.set([]);
    this.searchService
      .getAudioMedia(searchFormValues)
      .pipe(
        catchError(() => this.handleError()),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((data) => this.audio.set(data));
  }

  handleError() {
    this.searchError.set('There are more than 500 results. Refine your search.');
    return of([]);
  }

  tabChange(tab: TabDirective) {
    this.tab.set(tab.name as SearchResultsTab);

    this.lastSearchFormValues.update((formValues) => ({ ...formValues, resultsFor: tab.name }));

    this.onSearch(this.lastSearchFormValues());
  }
}
