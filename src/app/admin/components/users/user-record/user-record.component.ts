import { User } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { UserGroupsComponent } from '../user-groups/user-groups/user-groups.component';
import { UserTranscriptsComponent } from '../user-transcripts/user-transcripts.component';

@Component({
  selector: 'app-user-record',
  standalone: true,
  templateUrl: './user-record.component.html',
  styleUrl: './user-record.component.scss',
  imports: [
    CommonModule,
    LuxonDatePipe,
    TabsComponent,
    TabDirective,
    DetailsTableComponent,
    LoadingComponent,
    GovukBannerComponent,
    UserGroupsComponent,
    ValidationErrorSummaryComponent,
    UserTranscriptsComponent,
    GovukTagComponent,
    RouterLink,
  ],
})
export class UserRecordComponent {
  userService = inject(UserService);
  userAdminSvc = inject(UserAdminService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errors: ErrorSummaryEntry[] = [];

  user$ = this.userAdminSvc.getUser(this.route.snapshot.params.userId).pipe(shareReplay(1));
  isNewUser$ = this.route.queryParams.pipe(map((params) => !!params.newUser));
  isUpdatedUser$ = this.route.queryParams.pipe(map((params) => !!params.updated));

  groupChanges$ = this.route.queryParams.pipe(
    map((params) => ({
      assigned: params.assigned,
      removed: params.groupsRemoved,
    }))
  );

  isUserActivated$ = this.route.queryParams.pipe(map((params) => params.activated));
  isUserDeactivated$: Observable<number[]> = this.route.queryParams.pipe(
    map((params) => {
      if (params.deactivated) {
        return params.rolledBackTranscriptRequestIds ? params.rolledBackTranscriptRequestIds : [];
      }
    })
  );
  tab$ = this.route.queryParams.pipe(map((params) => params.tab));
  transcriptCount: number = 0;
  activationError = signal(Boolean(this.route.snapshot.queryParams?.error));

  handleTranscriptCount(count: number) {
    this.transcriptCount = count;
  }

  onActivateDeactivateUser(user: User) {
    // If the user is not active and the full name or email address is missing, show an error
    if ((!user.fullName || !user.emailAddress) && !user.active) {
      this.activationError.set(true);
      return;
    }

    this.router.navigate(['admin/users', user.id, !user.active ? 'activate' : 'deactivate'], { state: { user } });
  }
}
