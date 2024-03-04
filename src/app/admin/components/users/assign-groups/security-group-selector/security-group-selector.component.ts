import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { CheckboxListItem } from '@common/filters/checkbox-list/checkbox-list-item.type';
import { CheckboxListComponent } from '@common/filters/checkbox-list/checkbox-list.component';
import { GovukDetailsComponent } from '@common/govuk-details/govuk-details.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { Observable, combineLatest, map, of, startWith } from 'rxjs';

export type UserGroup = { id: number; name: string; role: string; displayState: boolean };

@Component({
  selector: 'app-security-group-selector',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    DataTableComponent,
    ReactiveFormsModule,
    TableRowTemplateDirective,
    NgFor,
    GovukDetailsComponent,
    JsonPipe,
    CheckboxListComponent,
    AsyncPipe,
  ],
  templateUrl: './security-group-selector.component.html',
  styleUrl: './security-group-selector.component.scss',
})
export class SecurityGroupSelectorComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  fb = inject(FormBuilder);

  @Input() groups: UserGroup[] = [];
  @Input() selectedGroupIds: number[] = [];
  @Output() assign = new EventEmitter<UserGroup[]>();
  @Output() cancel = new EventEmitter<void>();

  filteredGroups: UserGroup[] = [];
  selectedGroups: UserGroup[] = [];
  hiddenGroups: UserGroup[] = [];

  showSelectedPanel = true;

  roles: CheckboxListItem[] = [];

  cols: DatatableColumn[] = [
    { name: 'Group Name', prop: 'name', sortable: true },
    { name: 'Role', prop: 'role', sortable: true },
  ];

  form = this.fb.group({
    search: '',
    roles: [],
  });

  filteredGroups$: Observable<UserGroup[]> | null = null;

  ngOnInit() {
    this.selectedGroups = this.groups.filter((group) => this.selectedGroupIds.some((g) => g === group.id));
    // Get unique list roles based on the groups
    this.roles = Array.from(new Set(this.groups.map((g) => g.role))).map((role) => ({
      name: role,
    }));

    this.filteredGroups$ = combineLatest([
      of(this.groups),
      this.searchFormControl.valueChanges.pipe(startWith('')),
      this.rolesFormControl.valueChanges.pipe(startWith([])),
    ]).pipe(
      map(([groups, search, roles]) => {
        return groups
          .filter((group) => this.searchFilter(search, group))
          .filter((group) => this.roleFilter(roles, group));
      })
    );
  }

  deselectGroup(id: number) {
    this.selectedGroups = this.selectedGroups.filter((group) => group.id !== id);
  }

  onAssign() {
    this.assign.emit([...this.selectedGroups]);
  }

  onCancel() {}

  get searchFormControl() {
    return this.form.get('search') as FormControl;
  }

  get rolesFormControl() {
    return this.form.get('roles') as FormControl;
  }

  private roleFilter(roles: CheckboxListItem[], group: UserGroup): boolean {
    return roles.length ? roles.some((role) => role.name === group.role) : true;
  }

  private searchFilter(search: string, group: UserGroup): boolean {
    return search ? group.name.toLowerCase().includes(search?.toLowerCase()) : true;
  }
}
