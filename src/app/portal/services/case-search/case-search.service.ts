import { inject, Injectable, signal } from '@angular/core';
import { CaseSearchFormValues } from '@portal-types/case';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { BehaviorSubject, catchError, of, shareReplay, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaseSearchService {
  caseService = inject(CaseService);
  errorMsgService = inject(ErrorMessageService);

  private readonly previousSearchFormValues = signal<CaseSearchFormValues | null>(null);

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
    this.errorMsgService.clearErrorMessage();
    this.previousSearchFormValues.set(searchFormValues);
    this.search$.next(searchFormValues);
  }

  clearSearch(): void {
    this.errorMsgService.clearErrorMessage();
    this.previousSearchFormValues.set(null);
    this.search$.next(null);
  }

  getPreviousSearchFormValues() {
    return this.previousSearchFormValues.asReadonly();
  }
}
