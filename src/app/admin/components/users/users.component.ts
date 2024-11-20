import { UserSearchFormValues } from '@admin-types/users/user-search-form-values.type';
import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { FormStateService } from '@services/form-state.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { Subject } from 'rxjs/internal/Subject';
import { of } from 'rxjs/internal/observable/of';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';
import { UserSearchFormComponent } from './user-search-form/user-search-form.component';
import { UserSearchResultsComponent } from './user-search-results/user-search-results.component';

const defaultFormValues: UserSearchFormValues = {
  fullName: null,
  email: null,
  userStatus: 'active',
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [GovukHeadingComponent, UserSearchFormComponent, UserSearchResultsComponent, AsyncPipe, LoadingComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly usersSearchKey = 'admin-user-search';
  userService = inject(UserService);
  userAdminService = inject(UserAdminService);
  formStateService = inject(FormStateService);

  previousformValues = signal(this.formStateService.getFormValues<UserSearchFormValues>(this.usersSearchKey));
  formValues = computed(() => this.previousformValues() ?? defaultFormValues);

  router = inject(Router);

  search$ = new Subject<UserSearchFormValues | null>();
  loading$ = new Subject<boolean>();

  results$ = this.search$.pipe(
    tap(() => this.startLoading()),
    switchMap((values) => {
      if (!values) return of(null);
      return this.userAdminService.searchUsers(values);
    }),
    tap(() => this.stopLoading())
  );

  constructor() {
    effect(() => {
      this.search$.next(this.previousformValues());
    });
  }

  startLoading() {
    this.loading$.next(true);
  }

  stopLoading() {
    this.loading$.next(false);
  }

  onSubmit(values: UserSearchFormValues) {
    this.formStateService.setFormValues(this.usersSearchKey, values);
    this.search$.next(values); // Trigger the search
  }

  onClear() {
    this.formStateService.clearFormValues(this.usersSearchKey);
    this.search$.next(null); // Clear the search
  }
}
