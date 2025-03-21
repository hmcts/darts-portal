import { inject, Injectable, signal } from '@angular/core';
import { CaseSearchFormValues } from '@portal-types/case';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, catchError, of, shareReplay, switchMap, tap } from 'rxjs';

export const defaultFormValues: CaseSearchFormValues = {
  courthouses: [],
  caseNumber: '',
  courtroom: '',
  hearingDate: {
    type: '',
    specific: '',
    from: '',
    to: '',
  },
  judgeName: '',
  defendantName: '',
  eventTextContains: '',
};
@Injectable({
  providedIn: 'root',
})
export class CaseSearchService {
  caseService = inject(CaseService);
  errorMsgService = inject(ErrorMessageService);
  appInsightsService = inject(AppInsightsService);
  userService = inject(UserService);

  private readonly previousSearchFormValues = signal<CaseSearchFormValues>({ ...defaultFormValues });

  private search$ = new BehaviorSubject<CaseSearchFormValues | null>(null);

  isAdvancedSearch = signal(false);
  isSubmitted = signal(false);
  isLoading = signal(false);

  results$ = this.search$
    .pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((search) =>
        search
          ? this.caseService.searchCases(search).pipe(
              catchError(() => {
                this.errorMsgService.updateDisplayType('COMPONENT');
                return of(null);
              })
            )
          : of(null)
      )
    )
    .pipe(tap(() => this.isLoading.set(false)))
    .pipe(shareReplay(1));

  searchCases(searchFormValues: CaseSearchFormValues) {
    this.appInsightsService.logEvent('USER_PORTAL::CASE_SEARCH', {
      userId: this.userService.userState()?.userId,
      ...searchFormValues,
    });
    this.errorMsgService.clearErrorMessage();
    this.previousSearchFormValues.set(searchFormValues);
    this.search$.next(searchFormValues);
  }

  clearSearch(): void {
    this.errorMsgService.clearErrorMessage();
    this.previousSearchFormValues.set({ ...defaultFormValues });
    this.search$.next(null);
  }

  getPreviousSearchFormValues() {
    return this.previousSearchFormValues.asReadonly();
  }
}
