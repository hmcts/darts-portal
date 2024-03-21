import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-group-users',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './group-users.component.html',
  styleUrl: './group-users.component.scss',
})
export class GroupUsersComponent {}
