import { SecurityGroup, User } from '@admin-types/index';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-groups',
  standalone: true,
  imports: [DataTableComponent, GovukHeadingComponent, TableRowTemplateDirective],
  templateUrl: './user-groups.component.html',
  styleUrl: './user-groups.component.scss',
})
export class UserGroupsComponent implements OnInit {
  router = inject(Router);
  userService = inject(UserService);

  @Input({ required: true }) user!: User;
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  groupColumns = [
    { name: 'Name', prop: 'name', sortable: false },
    { name: 'Role', prop: 'role', sortable: false },
  ];

  userGroups: SecurityGroup[] = [];
  selectedGroups: SecurityGroup[] = [];
  removeError = false;

  ngOnInit() {
    this.userGroups = this.removeHiddenSecurityGroups(this.user.securityGroups ?? []);
  }

  onRemoveGroups() {
    if (this.selectedGroups.length) {
      this.router.navigate(['admin/users/', this.user.id, 'remove-groups'], {
        state: { user: this.user, selectedGroups: this.selectedGroups },
      });
    } else {
      this.removeError = true;
      this.errors.emit([{ message: 'Select one or more groups', fieldId: 'userGroupTable' }]);
    }
  }

  get selectedGroupsCountText() {
    return `${this.selectedGroups.length} of ${this.userGroups.length} groups selected`;
  }

  private removeHiddenSecurityGroups(userGroups: SecurityGroup[]): SecurityGroup[] {
    return userGroups.filter((group) => group.role?.displayState);
  }
}
