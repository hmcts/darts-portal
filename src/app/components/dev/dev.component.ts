import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FiltersComponent } from '@common/filters/filters.component';
import { TabDirective } from '@directives/tab.directive';
import { AppConfigService } from '@services/app-config/app-config.service';
import { TabsComponent } from '../common/tabs/tabs.component';

@Component({
  selector: 'app-dev',
  standalone: true,
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.scss',
  imports: [FiltersComponent, TabsComponent, TabDirective],
})
export class DevComponent {
  constructor(
    private appConfigSvc: AppConfigService,
    private router: Router
  ) {
    //Only allow access if running in development
    !this.appConfigSvc.isDevelopment() && this.router.navigateByUrl('page-not-found');
  }
}
