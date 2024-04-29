import { Component, Input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

export type GovukBannerType = 'success' | 'warning' | 'information';
@Component({
  selector: 'app-govuk-banner',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './govuk-banner.component.html',
  styleUrls: ['./govuk-banner.component.scss'],
})
export class GovukBannerComponent {
  @Input() text!: string;
  @Input() type: GovukBannerType = 'success';
}
