import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { shareReplay } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DataTableComponent } from '../../../../core/components/common/data-table/data-table.component';
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
    NotFoundComponent,
    LoadingComponent,
    GovukBannerComponent,
    DataTableComponent,
    GovukHeadingComponent,
    TableRowTemplateDirective,
    UserGroupsComponent,
    ValidationErrorSummaryComponent,
    UserTranscriptsComponent,
  ],
})
export class UserRecordComponent {
  userAdminSvc = inject(UserAdminService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errors: ErrorSummaryEntry[] = [];

  user$ = this.userAdminSvc.getUser(this.route.snapshot.params.userId).pipe(shareReplay(1));
  isNewUser$ = this.route.queryParams.pipe(map((params) => !!params.newUser));
  isUpdatedUser$ = this.route.queryParams.pipe(map((params) => !!params.updated));
  hasAssignedGroups$ = this.route.queryParams.pipe(map((params) => params.assigned));
  hasRemovedGroups$ = this.route.queryParams.pipe(map((params) => params.groupsRemoved));
  isUserActivated$ = this.route.queryParams.pipe(map((params) => params.activated));
  tab$ = this.route.queryParams.pipe(map((params) => params.tab));
}
