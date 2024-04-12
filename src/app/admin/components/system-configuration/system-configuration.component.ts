import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { RetentionPoliciesComponent } from '../retention-policies/retention-policies.component';

const tabUrlMap: { [key: string]: string } = {
  'Retention policies': '/admin/system-configuration/retention-policies',
  'Event mapping': '/admin/system-configuration/event-mapping',
  'Automated tasks': '/admin/system-configuration/automated-tasks',
};
@Component({
  selector: 'app-system-configuration',
  standalone: true,
  imports: [GovukHeadingComponent, TabsComponent, RetentionPoliciesComponent, TabDirective],
  templateUrl: './system-configuration.component.html',
  styleUrl: './system-configuration.component.scss',
})
export class SystemConfigurationComponent {
  router = inject(Router);

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
