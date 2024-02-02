import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { Observable } from 'rxjs';
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
  error$ = new Subject<any>();

  results$: Observable<User[] | null> = this.search$.pipe(
    tap(() => this.loading$.next(true)),
    switchMap((values) => {
      if (!values) {
        return of(null);
      }
      return this.userAdminService.searchUsers(values).pipe(
        catchError((error) => {
          this.error$.next(error);
          this.loading$.next(false);
          return of(null);
        })
      );
    }),
    tap(() => this.loading$.next(false))
  );

  isSubmitted = false;

  onSubmit(values: UserSearchFormValues) {
    this.isSubmitted = true;
    this.error$.next(null);
    this.search$.next(values);
  }

  onClear() {
    this.isSubmitted = false;
    this.search$.next(null);
    this.error$.next(null);
  }
}
