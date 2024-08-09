import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@components/common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { CaseSearchFormValues } from '@portal-types/case';
import { CaseSearchService } from '@services/case-search/case-search.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { CaseSearchFormComponent } from './case-search-form/case-search-form.component';
import { CaseSearchResultsComponent } from './case-search-results/case-search-results.component';
import { SearchErrorComponent } from './search-error/search-error.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CaseSearchResultsComponent,
    SearchErrorComponent,
    LoadingComponent,
    ValidationErrorSummaryComponent,
    GovukHeadingComponent,
    CaseSearchFormComponent,
    AsyncPipe,
  ],
})
export class SearchComponent {
  caseSearchService = inject(CaseSearchService);
  courthouseService = inject(CourthouseService);
  errorMsgService = inject(ErrorMessageService);
  scrollService = inject(ScrollService);

  courthouses = toSignal(this.courthouseService.getCourthouses(), { initialValue: [] });
  errorSummary = signal<ErrorSummaryEntry[]>([]);

  results = toSignal(this.caseSearchService.results$, { initialValue: null });
  searchError = toSignal(this.errorMsgService.errorMessage$, { initialValue: null });

  formValues = this.caseSearchService.getPreviousSearchFormValues();
  isAdvancedSearch = this.caseSearchService.isAdvancedSearch;
  isSubmitted = this.caseSearchService.isSubmitted;
  isLoading = this.caseSearchService.isLoading;

  onSearch(formValues: CaseSearchFormValues) {
    this.caseSearchService.searchCases(formValues);
    this.scrollService.scrollTo('#results');
  }

  onValidationError(errorSummary: ErrorSummaryEntry[]) {
    this.errorSummary.set(errorSummary);
  }

  onClear() {
    this.errorSummary.set([]);
    this.caseSearchService.clearSearch();
  }
}
