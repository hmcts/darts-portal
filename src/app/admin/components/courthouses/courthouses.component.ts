import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, Observable, Subject, combineLatest, of, switchMap, tap } from 'rxjs';
import { CourthouseSearchFormComponent } from './courthouse-search-form/courthouse-search-form.component';
import { CourthouseSearchResultsComponent } from './courthouse-search-results/courthouse-search-results.component';

@Component({
  selector: 'app-courthouses',
  standalone: true,
  imports: [CommonModule, GovukHeadingComponent, CourthouseSearchFormComponent, CourthouseSearchResultsComponent],
  templateUrl: './courthouses.component.html',
  styleUrl: './courthouses.component.scss',
})
export class CourthousesComponent {
  userService = inject(UserService);
  courthouseService = inject(CourthouseService);
  router = inject(Router);

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
