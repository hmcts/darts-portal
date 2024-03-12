import { SecurityGroup } from '@admin-types/users/security-group.type';
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
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-courthouse',
  standalone: true,
  templateUrl: './courthouse-record.component.html',
  styleUrl: './courthouse-record.component.scss',
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
export class CourthouseRecordComponent {
  courthouseService = inject(CourthouseService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  courthouse$ = this.courthouseService.getCourthouseWithRegionsAndSecurityGroups(
    this.route.snapshot.params.courthouseId
  );
  isNewCourthouse$ = this.route.queryParams.pipe(map((params) => !!params.newCourthouse));

  formatSecurityGroupLinks(securityGroups: SecurityGroup[] | undefined) {
    return securityGroups?.map((securityGroup) => {
      return { value: securityGroup.name, href: `/admin/groups/${securityGroup.id}` };
    });
  }
}
