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
    CaseSearchResultsComponent,
    LoadingComponent,
    JsonPipe,
    ValidationErrorSummaryComponent,
  ],
})
export class SearchComponent {
  courthouseService = inject(CourthouseService);
  searchService = inject(AdminSearchService);

  tab = signal<SearchResultsTab>('Cases');
  searchError = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  formValidationErrors = signal<ErrorSummaryEntry[]>([]);

  courthouses$ = this.courthouseService
    .getCourthouses()
    .pipe(map((data) => this.courthouseService.mapCourthouseDataToCourthouses(data)));

  courthouses = toSignal(this.courthouses$, {
    initialValue: [],
  });

  cases = signal<CaseSearchResult[]>([]);
  // hearings = signal<HearingSearchResult[]>([]);
  // events = signal<EventSearchResult[]>([]);
  // audio = signal<AudioSearchResult[]>([]);

  onSearch(searchFormValues: AdminSearchFormValues) {
    const resultsFor = searchFormValues.resultsFor as SearchResultsTab;
    this.tab.set(resultsFor);
    this.isSubmitted.set(true);
    this.isLoading.set(true);
    this.searchError.set(null);

    if (resultsFor === 'Cases') {
      this.cases.set([]);
      this.searchService
        .getCases(searchFormValues)
        .pipe(
          catchError(() => this.handleError()),
          finalize(() => this.isLoading.set(false))
        )
        .subscribe((data) => this.cases.set(data));
    } else {
      this.isLoading.set(false);
    }
  }

  handleError() {
    this.searchError.set('There are more than 500 results. Refine your search.');
    return of([]);
  }

  tabChange(tab: TabDirective) {
    this.tab.set(tab.name as SearchResultsTab);
  }
}
