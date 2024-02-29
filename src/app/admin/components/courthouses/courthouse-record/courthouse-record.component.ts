import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { SuccessBannerComponent } from '@common/success-banner/success-banner.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { TabDirective } from '@directives/tab.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CourthouseAdminService } from '@services/courthouse-admin.service';
import { SecurityGroup } from '@core-types/courthouse/security-groups.interface';

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
    SuccessBannerComponent,
  ],
})
export class CourthouseRecordComponent {
  courthouseAdminService = inject(CourthouseAdminService);
  route = inject(ActivatedRoute);

  courthouse$ = this.courthouseAdminService.getCourthouseWithRegionsAndSecurityGroups(
    this.route.snapshot.params.courthouseId
  );

  formatSecurityGroups(securityGroups: SecurityGroup[] | undefined) {
    return securityGroups?.map((securityGroup) => securityGroup.name).join('\n');
  }
}
