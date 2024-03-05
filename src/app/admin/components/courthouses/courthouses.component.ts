import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { BehaviorSubject, Observable, Subject, combineLatest, of, switchMap, tap } from 'rxjs';
import { CourthouseSearchFormComponent } from './courthouse-search-form/courthouse-search-form.component';
import { CourthouseSearchResultsComponent } from './courthouse-search-results/courthouse-search-results.component';

@Component({
  selector: 'app-courthouses',
  standalone: true,
  templateUrl: './courthouses.component.html',
  styleUrl: './courthouses.component.scss',
  imports: [CommonModule, GovukHeadingComponent, CourthouseSearchFormComponent, CourthouseSearchResultsComponent],
})
export class CourthousesComponent {
  courthouseService = inject(CourthouseService);

  search$ = new Subject<CourthouseSearchFormValues | null>();
  loading$ = new Subject<boolean>();
  isSubmitted$ = new BehaviorSubject<boolean>(false);

  courthouses$ = this.courthouseService.getCourthousesWithRegions();

  results$: Observable<Courthouse[]> = combineLatest([this.search$, this.isSubmitted$, this.courthouses$]).pipe(
    tap(() => this.startLoading()),
    switchMap(([values, isSubmitted, courthouses]) => {
      if (!values || !isSubmitted || !courthouses) {
        return of([]);
      }
      // Directly use the emitted courthouses array for filtering
      return this.courthouseService.searchCourthouses(courthouses, values);
    }),
    tap(() => this.stopLoading())
  );

  startLoading() {
    this.loading$.next(true);
  }

  stopLoading() {
    this.loading$.next(false);
  }

  onSubmit(values: CourthouseSearchFormValues) {
    this.isSubmitted$.next(true);
    this.search$.next(values);
  }

  onClear() {
    this.isSubmitted$.next(false);
    this.search$.next(null);
  }
}
