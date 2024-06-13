import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss',
})
export class NotificationBannerComponent {
  @Input() maxWidth = false;
  @Input() heading = '';
  @Input() body = '';
  @Input() list!: { name: string; value: string }[];
}
