import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TranscriptionService } from '@services/transcription/transcription.service';

@Component({
  selector: 'app-approve-transcript-buttons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApproveTranscriptButtonsComponent, RouterLink],
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

  get remainingCharacterCount() {
    return 2000 - (this.rejectReasonFormControl.value?.length || 0);
  }

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
          message: (this.buttonsError = 'You must choose whether you approve or reject this request'),
        },
      ]);
      return;
    }
  }

  onChange() {
    this.buttonsError = '';
    this.errors.emit([]);
  }

  private handleResponse() {
    this.errors.emit([]);
    this.router.navigate(['/transcriptions']);
  }
}
