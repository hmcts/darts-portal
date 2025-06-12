import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTabsComponent } from '@common/govuk-tabs/govuk-tabs.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { CaseSearchResultsComponent } from '@components/search/case-search-results/case-search-results.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { AdminSearchService } from '@services/admin-search/admin-search.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { isDateSpanMoreThanOneYear } from '@utils/date-range.utils';
import { finalize, map } from 'rxjs';
import { AudioSearchResultsComponent } from './audio-search-results/audio-search-results.component';
import { EventSearchResultsComponent } from './event-search-results/event-search-results.component';
import { HearingSearchResultsComponent } from './hearing-search-results/hearing-search-results.component';
import { AdminSearchFormValues, SearchFormComponent } from './search-form/search-form.component';

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
    ValidationErrorSummaryComponent,
    CaseSearchResultsComponent,
    HearingSearchResultsComponent,
    EventSearchResultsComponent,
    AudioSearchResultsComponent,
  ],
})
export class SearchComponent implements OnInit {
  courthouseService = inject(CourthouseService);
  searchService = inject(AdminSearchService);
  scrollService = inject(ScrollService);

  formValidationErrors = signal<ErrorSummaryEntry[]>([]);

  readonly validationSummarySelector = 'app-validation-error-summary';

  courthouses$ = this.courthouseService.getCourthouses().pipe(
    map((data) => this.courthouseService.mapCourthouseDataToCourthouses(data)),
    finalize(() => this.searchService.isLoading.set(false))
  );

  courthouses = toSignal(this.courthouses$, {
    initialValue: [],
  });

  ngOnInit(): void {
    this.refetchIfFlagged();
  }

  private refetchIfFlagged() {
    const values = this.searchService.formValues();
    const hasBeenSubmitted = this.searchService.hasFormBeenSubmitted();

    if (!hasBeenSubmitted || !values) return;

    const { resultsFor } = values;

    if (resultsFor === 'Cases' && this.searchService.fetchNewCases()) {
      this.searchService.getCases(values).subscribe();
      this.searchService.fetchNewCases.set(false);
    }

    if (resultsFor === 'Events' && this.searchService.fetchNewEvents()) {
      this.searchService.getEvents(values).subscribe();
      this.searchService.fetchNewEvents.set(false);
    }

    if (resultsFor === 'Audio' && this.searchService.fetchNewAudio()) {
      this.searchService.getAudioMedia(values).subscribe();
      this.searchService.fetchNewAudio.set(false);
    }
  }

  onValidationErrors(errors: ErrorSummaryEntry[]) {
    this.formValidationErrors.set(errors);
    this.scrollService.scrollTo(this.validationSummarySelector);
  }

  setForm(searchFormValues: AdminSearchFormValues) {
    this.searchService.formValues.set(searchFormValues);
  }

  onSearch(searchFormValues: AdminSearchFormValues) {
    this.searchService.hasFormBeenSubmitted.set(true);
    this.searchService.isLoading.set(true);
    this.searchService.searchError.set(null);

    switch (this.searchService.formValues().resultsFor) {
      case 'Cases':
        this.searchService.getCases(searchFormValues).subscribe();
        break;
      case 'Hearings':
        this.searchService.getHearings(searchFormValues).subscribe();
        break;
      case 'Events':
        this.searchService.getEvents(searchFormValues).subscribe();
        break;
      case 'Audio':
        this.searchService.getAudioMedia(searchFormValues).subscribe();
        break;
      default:
        this.searchService.isLoading.set(false);
    }

    this.scrollService.scrollTo('#results');
  }

  isSearchOk = computed(() => !this.searchService.isLoading() && !this.searchService.searchError());

  tabChange(tab: TabDirective) {
    const { from, to } = this.searchService.formValues().hearingDate;

    if (isDateSpanMoreThanOneYear(from, to)) {
      this.onLogicError({ code: 'COMMON_105', tabName: tab.name });
      return;
    }

    this.searchService.formValues.update((formValues) => ({ ...formValues, resultsFor: tab.name }));
    this.onSearch(this.searchService.formValues());
  }

  onLogicError(error: { code: string | null; tabName: string }) {
    if (error.code === 'COMMON_105') {
      this.searchService.searchError.set('COMMON_105');
      this.searchService.hasFormBeenSubmitted.set(true);
      this.searchService.formValues.update((formValues) => ({ ...formValues, resultsFor: error.tabName }));
      this.searchService.cases.set([]);
    } else {
      this.searchService.searchError.set(null);
    }
  }
}
