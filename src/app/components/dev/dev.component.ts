import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from '@common/filters/filter.interface';
import { FiltersComponent } from '@common/filters/filters.component';
import { TabDirective } from '@directives/tab.directive';
import { AppConfigService } from '@services/app-config/app-config.service';
import { TabsComponent } from '../common/tabs/tabs.component';

@Component({
  selector: 'app-dev',
  standalone: true,
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.scss',
  imports: [FiltersComponent, TabsComponent, TabDirective, CommonModule],
})
export class DevComponent {
  selectedFilters: Filter[] | null = null;

  constructor(
    private appConfigSvc: AppConfigService,
    private router: Router
  ) {
    //Only allow access if running in development
    !this.appConfigSvc.isDevelopment() && this.router.navigateByUrl('page-not-found');
  }

  getFilters(filters: Filter[]) {
    this.selectedFilters = filters;
  }

  //Hardcoded output data
  exampleOutput: Filter[] = [
    {
      display_name: 'Display name',
      name: 'display_name',
      values: ['Display name 4'],
    },
    {
      display_name: 'Courts',
      name: 'courts',
      values: ['Maidenhead', 'Kingston', 'Slough'],
      multiselect: true,
    },
    {
      display_name: 'Role type',
      name: 'role_type',
      values: ['Transcriber', 'Translation QA'],
      multiselect: true,
    },
  ];

  //Hardcoded filter data
  filters: Filter[] = [
    {
      display_name: 'Display name',
      name: 'display_name',
      values: [
        'Display name 1',
        'Display name 2',
        'Display name 3',
        'Display name 4',
        'Display name 5',
        'Display name 6',
      ],
      multiselect: false,
    },
    {
      display_name: 'Courts',
      name: 'courts',
      values: [
        'Reading',
        'Slough',
        'Kingston',
        'Maidenhead',
        'Basingstoke',
        'Bournemouth',
        'Southampton',
        'Cardiff',
        'Bridgend',
        'Gloucester',
        'Milton Keynes',
        'Andover',
        'Windsor',
        'Eton',
      ],
      multiselect: true,
      search: true,
    },
    {
      display_name: 'Role type',
      name: 'role_type',
      values: [
        'Approver',
        'Requester',
        'Judiciary',
        'Super User',
        'Translation QA',
        'Transcriber',
        'Admin (Admin Portal)',
        'Super Admin (Admin Portal)',
      ],
      multiselect: true,
      search: true,
    },
  ];
}
