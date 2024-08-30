import { Event } from '@admin-types/events';
import { Component, input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-advanced-event-details',
  standalone: true,
  imports: [LuxonDatePipe, GovukHeadingComponent],
  templateUrl: './advanced-event-details.component.html',
  styleUrl: './advanced-event-details.component.scss',
})
export class AdvancedEventDetailsComponent {
  event = input.required<Event>();
}
