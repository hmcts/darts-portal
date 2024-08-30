import { Event } from '@admin-types/events';
import { Component, input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-basic-event-details',
  standalone: true,
  imports: [LuxonDatePipe, GovukHeadingComponent],
  templateUrl: './basic-event-details.component.html',
  styleUrl: './basic-event-details.component.scss',
})
export class BasicEventDetailsComponent {
  event = input.required<Event>();
}
