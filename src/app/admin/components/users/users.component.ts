import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { of } from 'rxjs/internal/observable/of';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';
import { UserSearchFormValues } from '../../models/users/user-search-form-values.type';
import { UserAdminService } from './../../services/user-admin.service';
import { UserSearchFormComponent } from './user-search-form/user-search-form.component';
import { UserSearchResultsComponent } from './user-search-results/user-search-results.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    UserSearchFormComponent,
    UserSearchResultsComponent,
    AsyncPipe,
    JsonPipe,
    LoadingComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  userAdminService = inject(UserAdminService);
  router = inject(Router);

  search$ = new Subject<UserSearchFormValues | null>();
  loading$ = new Subject<boolean>();
  isSubmitted$ = new BehaviorSubject<boolean>(false);

  results$ = combineLatest([this.search$, this.isSubmitted$]).pipe(
    tap(() => this.startLoading()),
    switchMap(([values, isSubmitted]) => {
      if (!values || !isSubmitted) {
        return of(null);
      }
      return this.userAdminService.searchUsers(values);
    }),
    tap(() => this.stopLoading())
  );

  startLoading() {
    this.loading$.next(true);
  }

  stopLoading() {
    this.loading$.next(false);
  }

  onSubmit(values: UserSearchFormValues) {
    this.isSubmitted$.next(true);
    this.search$.next(values); // Trigger the search
  }

  onClear() {
    this.isSubmitted$.next(false);
    this.search$.next(null); // Clear the search
  }
}
