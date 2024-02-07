import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { User } from 'src/app/admin/models/users/user.type'; //TO DO create admin-type alias

@Component({
  selector: 'app-user-search-results',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, NgClass],
  templateUrl: './user-search-results.component.html',
  styleUrl: './user-search-results.component.scss',
})
export class UserSearchResultsComponent {
  @Input() results: User[] = [];
  columns: DatatableColumn[] = [
    { name: 'Full name', prop: 'fullName', sortable: true },
    { name: 'Email address', prop: 'emailAddress', sortable: true },
    { name: 'Status', prop: 'active', sortable: true },
    { name: '', prop: '' },
  ];

  get caption() {
    return `${this.results.length} result${this.results.length > 1 ? 's' : ''}`;
  }
}
