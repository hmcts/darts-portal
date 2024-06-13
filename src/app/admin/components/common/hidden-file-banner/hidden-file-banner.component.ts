import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationBannerComponent } from '@common/notification-banner/notification-banner.component';

@Component({
  selector: 'app-hidden-file-banner',
  standalone: true,
  imports: [NotificationBannerComponent],
  templateUrl: './hidden-file-banner.component.html',
  styleUrl: './hidden-file-banner.component.scss',
})
export class HiddenFileBannerComponent {
  @Input() file!: HiddenFileBanner;

  router = inject(Router);

  get heading() {
    return this.file.isMarkedForManualDeletion
      ? 'This file is hidden in DARTS and is marked for manual deletion'
      : 'This file is hidden in DARTS';
  }

  onHideOrDelete() {
    this.router.navigate(['admin/file', this.file.id, 'hide-or-delete'], {
      state: { fileType: this.file.fileType },
    });
  }
}
