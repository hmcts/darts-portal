import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { Component, Input, OnInit, inject } from '@angular/core';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';

@Component({
  selector: 'app-transcript-details',
  standalone: true,
  templateUrl: './transcript-details.component.html',
  styleUrl: './transcript-details.component.scss',
  imports: [DetailsTableComponent],
})
export class TranscriptDetailsComponent implements OnInit {
  transcriptionService = inject(TranscriptionService);
  transcriptionAdminService = inject(TranscriptionAdminService);

  @Input() transcript!: TranscriptionAdminDetails;

  requestDetails = {};
  caseDetails = {};
  currentStatus = {};

  ngOnInit(): void {
    this.currentStatus = this.transcriptionAdminService.getCurrentStatusFromTranscript(this.transcript);
    this.requestDetails = this.transcriptionAdminService.getRequestDetailsFromTranscript(this.transcript);
    this.caseDetails = this.transcriptionService.getCaseDetailsFromTranscript(this.transcript);
  }
}
