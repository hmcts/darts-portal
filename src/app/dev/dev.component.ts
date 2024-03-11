import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Filter } from '@common/filters/filter.interface';
import { FiltersComponent } from '@common/filters/filters.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { AppConfigService } from '@services/app-config/app-config.service';
import { HeaderService } from '@services/header/header.service';
import {
  SecurityGroupSelectorComponent,
  UserGroup,
} from '../admin/components/users/assign-groups/security-group-selector/security-group-selector.component';
import { CheckboxListComponent } from './../core/components/common/filters/checkbox-list/checkbox-list.component';

@Component({
  selector: 'app-dev',
  standalone: true,
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.scss',
  imports: [
    FiltersComponent,
    TabsComponent,
    TabDirective,
    CommonModule,
    SecurityGroupSelectorComponent,
    ReactiveFormsModule,
    CheckboxListComponent,
  ],
})
export class DevComponent implements OnInit {
  selectedFilters: Filter[] | null = null;

  headerService = inject(HeaderService);
  appConfigService = inject(AppConfigService);
  router = inject(Router);

  ngOnInit(): void {
    //Only allow access if running in development
    if (!this.appConfigService.isDevelopment()) {
      this.router.navigateByUrl('page-not-found');
    }
  }

  getFilters(filters: Filter[]) {
    this.selectedFilters = filters;
  }

  //Hardcoded output data
  exampleOutput: Filter[] = [
    {
      displayName: 'Display name',
      name: 'displayName',
      values: ['Display name 4'],
    },
    {
      displayName: 'Courts',
      name: 'courts',
      values: ['Maidenhead', 'Kingston', 'Slough'],
      multiselect: true,
    },
    {
      displayName: 'Role type',
      name: 'role_type',
      values: ['Transcriber', 'Translation QA'],
      multiselect: true,
    },
  ];

  //Hardcoded filter data
  filters: Filter[] = [
    {
      displayName: 'Display name',
      name: 'displayName',
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
      displayName: 'Courts',
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
      displayName: 'Role type',
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

  // Assign groups
  groups = [
    { id: 1, name: 'Group 1', role: 'Approver', displayState: true },
    { id: 2, name: 'Group 2', role: 'Requester', displayState: true },
    { id: 3, name: 'Group 3', role: 'Judge', displayState: true },
    { id: 4, name: 'Group 4', role: 'Transcriber', displayState: true },
    { id: 5, name: 'Group 5', role: 'Translation QA', displayState: true },
    { id: 6, name: 'Group 6', role: 'Secret', displayState: false },
  ];
  selectedGroups: UserGroup[] = [];

  // Checkbox list
  checkboxItems = [{ name: 'Approver' }, { name: 'Requester' }, { name: 'Judge' }, { name: 'Transcriber' }];
  checkboxes = new FormControl([], { nonNullable: true });
}
