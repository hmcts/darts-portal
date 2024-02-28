import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { TabDirective } from '@directives/tab.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map } from 'rxjs/internal/operators/map';

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
  ],
})
export class UserRecordComponent {
  userAdminSvc = inject(UserAdminService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  user$ = this.userAdminSvc.getUser(this.route.snapshot.params.userId);
  isNewUser$ = this.route.queryParams.pipe(map((params) => !!params.newUser));
  isUpdatedUser$ = this.route.queryParams.pipe(map((params) => !!params.updated));
}
