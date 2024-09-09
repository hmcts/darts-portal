import { Component, computed, input } from '@angular/core';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-expired-banner',
  standalone: true,
  imports: [LuxonDatePipe, GovukBannerComponent],
  templateUrl: './expired-banner.component.html',
  styleUrl: './expired-banner.component.scss',
})
export class ExpiredBannerComponent {
  expiryDate = input.required<DateTime>();
  isExpired = computed(() => this.expiryDate() < DateTime.now());
}
