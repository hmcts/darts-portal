import { CourthouseUser } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { Filter } from '@common/filters/filter.interface';
import { FiltersComponent } from '@common/filters/filters.component';
import { DatatableColumn } from '@core-types/data-table/data-table-column.interface';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-courthouse-users',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FiltersComponent],
  templateUrl: './courthouse-users.component.html',
  styleUrl: './courthouse-users.component.scss',
})
export class CourthouseUsersComponent implements OnInit {
  @Input() users: CourthouseUser[] = [];
  @Output() selectRowsEvent = new EventEmitter<CourthouseUser[]>();
  selectedRows = [] as CourthouseUser[];

  userService = inject(UserService);

  selectedFilters: Filter[] | null = null;
  fullUsers: CourthouseUser[] = [];

  readonly userNameFilterName = 'userName';
  readonly roleTypeFilterName = 'roleType';

  uniqueUserNames: string[] = [];
  filters: Filter[] = [];

  columns: DatatableColumn[] = [
    { name: 'User name', prop: 'userName', sortable: true },
    { name: 'Email', prop: 'email', sortable: true },
    { name: 'Role type', prop: 'roleType', sortable: true },
  ];

  setFilters(criteria: Filter[]) {
    if (!criteria.length) {
      this.users = this.fullUsers;
      return;
    }

    const userNameCriteria = criteria.find((c) => c.name === this.userNameFilterName);
    const roleTypeCriteria = criteria.find((c) => c.name === this.roleTypeFilterName);

    this.users = this.fullUsers
      .filter((user) => (userNameCriteria ? userNameCriteria.values.includes(user.userName) : true))
      .filter((user) => (roleTypeCriteria ? roleTypeCriteria.values.includes(user.roleType) : true));
  }

  outputSelectedRows() {
    if (this.selectedRows.length) {
      this.selectRowsEvent.emit(this.selectedRows);
    }
  }

  clearFilters() {
    this.users = this.fullUsers;
  }

  ngOnInit(): void {
    this.fullUsers = this.users;
    this.uniqueUserNames = [...new Set(this.users.map((user) => user.userName))];
    this.filters = [
      {
        displayName: 'User name',
        name: this.userNameFilterName,
        values: [...this.uniqueUserNames],
        multiselect: true,
        search: true,
      },
      {
        displayName: 'Role type',
        name: this.roleTypeFilterName,
        values: ['Requester', 'Approver'],
        multiselect: true,
      },
    ];
  }
}
