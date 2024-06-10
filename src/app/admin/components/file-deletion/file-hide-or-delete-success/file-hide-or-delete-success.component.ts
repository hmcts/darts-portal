import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-file-hide-or-delete-success',
  standalone: true,
  templateUrl: './file-hide-or-delete-success.component.html',
  styleUrl: './file-hide-or-delete-success.component.scss',
  imports: [GovukBannerComponent, GovukHeadingComponent],
})
export class FileHideOrDeleteSuccessComponent {
  router = inject(Router);

  @Input() id!: number;
  @Input() fileType: string = 'transcription_document';
  @Input() continueLink: string = '/admin';

  goTo() {
    this.router.navigate([this.continueLink]);
  }
}
