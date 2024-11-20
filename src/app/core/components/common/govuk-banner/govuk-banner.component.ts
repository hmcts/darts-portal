import { Component, Input } from '@angular/core';

export type GovukBannerType = 'success' | 'warning' | 'information';
@Component({
  selector: 'app-govuk-banner',
  standalone: true,
  imports: [],
  templateUrl: './govuk-banner.component.html',
  styleUrls: ['./govuk-banner.component.scss'],
})
export class GovukBannerComponent {
  @Input() text!: string;
  @Input() type: GovukBannerType = 'success';
  @Input() ariaLabel!: string;
}
