import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { GovukHeadingComponent } from '@components/common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TranscriptionDetails } from '@portal-types/index';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { AppConfigService } from '@services/app-config/app-config.service';
import { ARM_MAINTENANCE_TRANSCRIPT_MESSAGE } from '@constants/arm-maintenance-messages';

@Component({
  selector: 'app-approved-transcript',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BreadcrumbDirective,
    DetailsTableComponent,
    GovukHeadingComponent,
    ReportingRestrictionComponent,
    GovukTagComponent,
    GovukBannerComponent,
  ],
  templateUrl: './approved-transcript.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './approved-transcript.component.scss',
})
export class ApprovedTranscriptComponent implements OnInit {
  datePipe = inject(DatePipe);
  route = inject(ActivatedRoute);
  transcriptionService = inject(TranscriptionService);
  fileDownloadService = inject(FileDownloadService);
  appConfigService = inject(AppConfigService);

  @Input() transcript!: TranscriptionDetails;

  armMaintenanceError = false;

  readonly armMaintenanceMessage = ARM_MAINTENANCE_TRANSCRIPT_MESSAGE;

  statusColours = transcriptStatusTagColours;
  caseDetails = {};
  requestDetails = {};

  transcriptId = this.route.snapshot.params.transcriptId;
  fileName?: string;

  ngOnInit(): void {
    this.caseDetails = this.transcriptionService.getCaseDetailsFromTranscript(this.transcript);
    this.requestDetails = this.transcriptionService.getRequestDetailsFromTranscript(this.transcript);
    this.fileName = this.transcript.transcriptFileName;
  }

  onDownloadClicked() {
    this.armMaintenanceError = false;

    const armDown = this.appConfigService.getAppConfig()?.armDownForMaintenance === 'true';

    if (armDown && this.transcript.isArchived) {
      this.armMaintenanceError = true;
      return;
    }

    if (this.fileName) {
      this.transcriptionService.downloadTranscriptDocument(this.transcriptId).subscribe((blob: Blob) => {
        this.fileDownloadService.saveAs(blob, this.fileName as string);
      });
    }
  }
}
