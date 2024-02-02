import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { of } from 'rxjs/internal/observable/of';
import { catchError } from 'rxjs/internal/operators/catchError';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';
import { UserSearchFormValues } from '../../models/users/user-search-form-values.type';
import { User } from '../../models/users/user.type';
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

  search$ = new Subject<UserSearchFormValues | null>();
  loading$ = new Subject<boolean>();
  error$ = new Subject<any>(); // TODO: Define error type
  isSubmitted$ = new BehaviorSubject<boolean>(false);

  results$ = combineLatest([this.search$, this.isSubmitted$]).pipe(
    tap(() => this.startLoading()),
    switchMap(([values, isSubmitted]) => {
      if (!values || !isSubmitted) {
        return of(null);
      }
      return this.searchUsers(values);
    }),
    tap(() => this.stopLoading())
  );

  searchUsers(values: UserSearchFormValues): Observable<User[] | null> {
    return this.userAdminService.searchUsers(values).pipe(
      catchError((error) => {
        this.handleError(error);
        return of(null);
      })
    );
  }

  startLoading() {
    this.loading$.next(true);
  }

  stopLoading() {
    this.loading$.next(false);
  }

  handleError(error: any) {
    this.error$.next(error);
    this.stopLoading();
  }

  onSubmit(values: UserSearchFormValues) {
    this.isSubmitted$.next(true);
    this.error$.next(null); // Clear any previous errors
    this.search$.next(values); // Trigger the search
  }

  onClear() {
    this.isSubmitted$.next(false);
    this.search$.next(null);
    this.error$.next(null);
  }
}
