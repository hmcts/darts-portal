import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { TagColour } from '@core-types/index';

@Component({
  selector: 'app-govuk-tag',
  standalone: true,
  imports: [],
  templateUrl: './govuk-tag.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './govuk-tag.component.scss',
})
export class GovukTagComponent {
  colour = input<TagColour>('blue');
  class = computed(() => `govuk-tag govuk-tag--${this.colour()}`);
}
