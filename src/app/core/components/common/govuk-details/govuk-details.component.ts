import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-govuk-details',
  standalone: true,
  imports: [],
  templateUrl: './govuk-details.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './govuk-details.component.scss',
})
export class GovukDetailsComponent {
  @Input() openSummary = 'Hide';
  @Input() closedSummary = 'Show';
  isOpen = false;
}
