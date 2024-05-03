import { AutomatedTaskStatus } from '@admin-types/automated-task/automated-task-status';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { map } from 'rxjs';
import { AutomatedTaskStatusComponent } from '../automated-tasks/automated-task-status/automated-task-status.component';
import { AutomatedTasksComponent } from '../automated-tasks/automated-tasks.component';
import { RetentionPoliciesComponent } from '../retention-policies/retention-policies.component';

const tabUrlMap: { [key: string]: string } = {
  'Retention policies': '/admin/system-configuration/retention-policies',
  'Event mapping': '/admin/system-configuration/event-mapping',
  'Automated tasks': '/admin/system-configuration/automated-tasks',
};
@Component({
  selector: 'app-system-configuration',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    TabsComponent,
    RetentionPoliciesComponent,
    TabDirective,
    GovukBannerComponent,
    AsyncPipe,
    AutomatedTasksComponent,
    AutomatedTaskStatusComponent,
  ],
  templateUrl: './system-configuration.component.html',
  styleUrl: './system-configuration.component.scss',
})
export class SystemConfigurationComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  hasPolicyCreated$ = this.route.queryParams.pipe(map((params) => !!params.created));
  hasPolicyUpdated$ = this.route.queryParams.pipe(map((params) => !!params.updated));
  hasPolicyRevised$ = this.route.queryParams.pipe(map((params) => !!params.revised));
  taskStatus: AutomatedTaskStatus | null = null;

  currentTab = this.getTabFromUrl(this.router.url);

  onTabChanged(tab: TabDirective) {
    if (this.currentTab !== tab.name) {
      const url = this.getUrlFromTab(tab.name);
      this.router.navigate([url]);
    }
  }

  getTabFromUrl(url: string) {
    return Object.keys(tabUrlMap).find((key) => tabUrlMap[key] === url) ?? 'Retention policies';
  }

  getUrlFromTab(tab: string) {
    return tabUrlMap[tab];
  }
}
