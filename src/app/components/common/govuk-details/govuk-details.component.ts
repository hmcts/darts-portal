import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-details',
  standalone: true,
  imports: [],
  templateUrl: './govuk-details.component.html',
  styleUrl: './govuk-details.component.scss',
})
export class GovukDetailsComponent {
  @Input() openSummary = 'Hide';
  @Input() closedSummary = 'Show';
  isOpen = false;
}
