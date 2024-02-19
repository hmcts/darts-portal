import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss',
})
export class NotificationBannerComponent {
  @Input() heading = '';
  @Input() body = '';
}
