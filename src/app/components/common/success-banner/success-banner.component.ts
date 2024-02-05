import { Component, Input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-success-banner',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './success-banner.component.html',
  styleUrls: ['./success-banner.component.scss'],
})
export class SuccessBannerComponent {
  @Input() text!: string;
}
