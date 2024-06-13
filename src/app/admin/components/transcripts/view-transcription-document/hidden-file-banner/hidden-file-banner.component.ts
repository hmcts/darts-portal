import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { User } from '@admin-types/index';
import { TranscriptionDocument } from '@admin-types/transcription';
import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationBannerComponent } from '@common/notification-banner/notification-banner.component';
import { TranscriptionDetails } from '@portal-types/index';

@Component({
  selector: 'app-hidden-file-banner',
  standalone: true,
  templateUrl: './hidden-file-banner.component.html',
  styleUrl: './hidden-file-banner.component.scss',
  imports: [NotificationBannerComponent, RouterLink],
})
export class HiddenFileBannerComponent {
  router = inject(Router);

  @Input() transcription!: {
    document: TranscriptionDocument;
    details: TranscriptionDetails;
    hiddenByUser: User | null;
    hiddenReason: HiddenReason | null | undefined;
  };
}
