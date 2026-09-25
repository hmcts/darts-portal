import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-banner.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './notification-banner.component.scss',
})
export class NotificationBannerComponent {
  @Input() maxWidth = false;
  @Input() heading = '';
  @Input() body = '';
  @Input() list!: { name: string; value: string }[];
}
