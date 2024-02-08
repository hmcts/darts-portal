import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { UserSearchFormValues } from '../../models/users/user-search-form-values.type';
import { UserSearchFormComponent } from './user-search-form/user-search-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [GovukHeadingComponent, UserSearchFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  onSubmit(values: UserSearchFormValues) {
    console.log(values);
  }
  onClear() {
    console.log('clear search');
  }
}
