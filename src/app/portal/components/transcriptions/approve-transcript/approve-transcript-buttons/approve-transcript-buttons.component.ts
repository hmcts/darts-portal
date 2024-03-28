import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukTextareaComponent } from '@components/common/govuk-textarea/govuk-textarea.component';
import { TranscriptionService } from '@services/transcription/transcription.service';

@Component({
  selector: 'app-approve-transcript-buttons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApproveTranscriptButtonsComponent, RouterLink, GovukTextareaComponent],
  templateUrl: './approve-transcript-buttons.component.html',
  styleUrl: './approve-transcript-buttons.component.scss',
})
export class ApproveTranscriptButtonsComponent {
  @Output() errors = new EventEmitter<{ fieldId: string; message: string }[]>();
  transcriptionService = inject(TranscriptionService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  transcriptId = this.route.snapshot.params.transcriptId;

  rejectReasonFormControl = new FormControl('');
  approveFormControl = new FormControl('');
  buttonsError = '';

  onSubmit() {
    if (this.approveFormControl.value === 'No') {
      if (!this.rejectReasonFormControl.value?.length) {
        this.errors.emit([
          {
            fieldId: 'reject-reason',
            message: (this.buttonsError = 'You must explain why you cannot approve this request'),
          },
        ]);
        return;
      }
      this.transcriptionService
        .rejectTranscriptionRequest(this.transcriptId, this.rejectReasonFormControl.value)
        .subscribe(() => {
          this.handleResponse();
        });
    } else if (this.approveFormControl.value === 'Yes') {
      this.transcriptionService.approveTranscriptionRequest(this.transcriptId).subscribe(() => {
        this.handleResponse();
      });
    } else {
      this.errors.emit([
        {
          fieldId: 'approval-radios',
          message: (this.buttonsError = 'Select if you approve this request or not'),
        },
      ]);
      return;
    }
  }

  onChange(value: string) {
    if (value !== this.approveFormControl.value) {
      this.buttonsError = '';
      this.errors.emit([]);
    }
  }

  private handleResponse() {
    this.errors.emit([]);
    this.router.navigate(['/transcriptions']);
  }
}
