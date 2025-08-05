import { User } from '@admin-types/index';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AutoCompleteComponent, AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn, ErrorSummaryEntry } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { UserService } from '@services/user/user.service';

type UserWithCheckboxLabel = User & { checkboxLabel?: string };
@Component({
  selector: 'app-group-users',
  standalone: true,
  imports: [GovukHeadingComponent, AutoCompleteComponent, DataTableComponent, TableRowTemplateDirective, LuxonDatePipe],
  templateUrl: './group-users.component.html',
  styleUrl: './group-users.component.scss',
})
export class GroupUsersComponent implements OnInit {
  userId = inject(UserService).userState()?.userId;

  @Input() isAdmin = false;
  @Input() allUsers: User[] = [];
  @Input({ transform: addCheckboxLabelToUsers }) groupUsers: UserWithCheckboxLabel[] = [];
  @Output() update = new EventEmitter<number[]>();
  @Output() remove = new EventEmitter<{ groupUsers: User[]; userIdsToRemove: number[] }>();
  @Output() validationError = new EventEmitter<ErrorSummaryEntry>();

  userToAdd: User | null = null;
  usersToRemove: User[] = [];
  autoCompleteUsers: AutoCompleteItem[] = [];
  invalidUserSubmitted = false;

  tableColumns: DatatableColumn[] = [
    { name: 'Name', prop: 'fullName', sortable: true },
    { name: 'Email', prop: 'emailAddress', sortable: true },
    { name: 'Last logged in', prop: 'lastLoginAt', sortable: true },
    { name: 'Status', prop: 'active', sortable: true },
  ];

  ngOnInit() {
    this.autoCompleteUsers = this.allUsers
      .filter((user) => !this.groupUsers.includes(user)) // Filter out users that are already in the group
      .map((user) => {
        return { id: user.id, name: `${user.fullName} (${user.emailAddress})` }; // Map the user to an AutoCompleteItem
      });
  }

  onUserSelect(selectedUser: AutoCompleteItem | null) {
    this.userToAdd = this.allUsers.find((user) => user.id === selectedUser?.id) ?? null;
    this.invalidUserSubmitted = this.userToAdd === null;
  }

  onAddUserToCourthouse() {
    if (this.userToAdd) {
      //Check against self-editing
      if (this.userToAdd.id === this.userId) {
        this.validationError.emit({
          fieldId: 'group-users',
          message: 'You cannot assign yourself to or remove yourself from any group.',
        });
        this.userToAdd = null;
        return;
      }
      // Add the user to the group
      this.groupUsers = [...this.groupUsers, this.userToAdd];
      // Remove the user from the autocomplete list
      this.autoCompleteUsers = this.autoCompleteUsers.filter((user) => user.id !== this.userToAdd?.id);

      this.update.emit(this.groupUsers.map((user) => user.id));
      this.userToAdd = null;
      this.invalidUserSubmitted = false;
    } else {
      this.invalidUserSubmitted = true;
    }
  }

  onRemoveUsersButtonClicked() {
    // if no users are selected, remove all users from the group
    // otherwise, remove the selected users
    const userIdsToRemove = this.usersToRemove.length
      ? this.usersToRemove.map((user) => user.id)
      : this.groupUsers.map((user) => user.id);

    this.remove.emit({ groupUsers: this.groupUsers, userIdsToRemove: userIdsToRemove });
  }
}

export function addCheckboxLabelToUsers(users: User[]): UserWithCheckboxLabel[] {
  return users.map((u) => ({ ...u, checkboxLabel: `Select user: ${u.fullName}` }));
}
