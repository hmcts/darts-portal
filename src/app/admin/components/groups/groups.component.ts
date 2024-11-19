import { SecurityGroup } from '@admin-types/index';
import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { CheckboxListComponent } from '@common/filters/checkbox-list/checkbox-list.component';
import { GovukDetailsComponent } from '@common/govuk-details/govuk-details.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { FormStateService } from '@services/form-state.service';
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
    CheckboxListComponent,
    GovukDetailsComponent,
    LoadingComponent,
    RouterLink,
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent {
  private readonly groupSearchFormKey = 'admin-groups-search';

  groupsService = inject(GroupsService);
  router = inject(Router);
  fb = inject(FormBuilder);
  formStateService = inject(FormStateService);

  previousformValues = signal(
    this.formStateService.getFormValues<{ search: string; role: string }>(this.groupSearchFormKey)
  );

  form = this.fb.group({
    search: '',
    role: '',
  });

  eff = effect(() => {
    if (this.previousformValues()) {
      this.form.controls.search.setValue(this.previousformValues()!.search);
      this.form.controls.role.setValue(this.previousformValues()!.role);
    }
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
      this.formStateService.setFormValues(this.groupSearchFormKey, { search, role });
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
    return this.form.get('role') as FormControl;
  }

  private roleFilter(role: string, group: SecurityGroup): boolean {
    return role ? role === group.role?.name : true;
  }

  private searchFilter(search: string, group: SecurityGroup): boolean {
    return search ? group.name.toLowerCase().includes(search?.toLowerCase()) : true;
  }
}
