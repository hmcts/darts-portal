import { SecurityGroup } from '@admin-types/index';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { CheckboxListComponent } from '@common/filters/checkbox-list/checkbox-list.component';
import { GovukDetailsComponent } from '@common/govuk-details/govuk-details.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { GroupsService } from '@services/groups/groups.service';
import { BehaviorSubject, combineLatest, map, shareReplay, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    DataTableComponent,
    TableRowTemplateDirective,
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe,
    CheckboxListComponent,
    GovukDetailsComponent,
    LoadingComponent,
    RouterLink,
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent {
  groupsService = inject(GroupsService);
  router = inject(Router);
  fb = inject(FormBuilder);

  form = this.fb.group({
    search: '',
    roles: [],
  });

  columns: DatatableColumn[] = [
    { name: 'Name', prop: 'name', sortable: false },
    { name: 'Description', prop: 'description', sortable: false },
    { name: 'Role', prop: 'role', sortable: false },
  ];

  loading$ = new BehaviorSubject<boolean>(true);
  groupsAndRoles$ = this.groupsService.getGroupsAndRoles().pipe(shareReplay(1));
  groups$ = this.groupsAndRoles$.pipe(map((security) => security.groups.filter((group) => group.role?.displayState)));
  roles$ = this.groupsAndRoles$.pipe(map((security) => security.roles.filter((role) => role.displayState)));

  filteredGroups$ = combineLatest([
    this.groups$,
    this.searchFormControl.valueChanges.pipe(startWith('')),
    this.rolesFormControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([groups, search, role]) => {
      return groups.filter((group) => this.searchFilter(search, group)).filter((group) => this.roleFilter(role, group));
    })
  );

  data$ = combineLatest({ groups: this.filteredGroups$, roles: this.roles$ }).pipe(
    tap(() => this.loading$.next(false))
  );

  get searchFormControl() {
    return this.form.get('search') as FormControl;
  }

  get rolesFormControl() {
    return this.form.get('roles') as FormControl;
  }

  private roleFilter(role: string, group: SecurityGroup): boolean {
    return role.length ? role === group.role?.name : true;
  }

  private searchFilter(search: string, group: SecurityGroup): boolean {
    return search ? group.name.toLowerCase().includes(search?.toLowerCase()) : true;
  }
}
