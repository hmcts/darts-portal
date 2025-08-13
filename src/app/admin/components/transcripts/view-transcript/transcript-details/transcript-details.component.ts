import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-transcript-details',
  standalone: true,
  templateUrl: './transcript-details.component.html',
  styleUrl: './transcript-details.component.scss',
  imports: [GovukHeadingComponent, JoinPipe, RouterLink, GovukSummaryListDirectives, LuxonDatePipe],
})
export class TranscriptDetailsComponent {
  transcriptionService = inject(TranscriptionService);
  transcriptionAdminService = inject(TranscriptionAdminService);
  isAdmin = inject(UserService).isAdmin();

  @Input() transcript!: TranscriptionAdminDetails;
}
