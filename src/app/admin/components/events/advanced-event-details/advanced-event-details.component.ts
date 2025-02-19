import { Event } from '@admin-types/events';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-advanced-event-details',
  standalone: true,
  imports: [LuxonDatePipe, GovukHeadingComponent, RouterLink],
  templateUrl: './advanced-event-details.component.html',
  styleUrl: './advanced-event-details.component.scss',
})
export class AdvancedEventDetailsComponent {
  userService = inject(UserService);
  event = input.required<Event>();
}
