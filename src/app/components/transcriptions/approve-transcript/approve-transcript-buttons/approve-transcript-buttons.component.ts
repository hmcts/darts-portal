import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-approve-transcript-buttons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApproveTranscriptButtonsComponent],
  templateUrl: './approve-transcript-buttons.component.html',
  styleUrl: './approve-transcript-buttons.component.scss',
})
export class ApproveTranscriptButtonsComponent {
  // @Output() rejectError = new EventEmitter<string>();
  @Output() errors = new EventEmitter<{ fieldId: string; message: string }[]>();

  rejectReasonFormControl = new FormControl('');
  approveFormControl = new FormControl('');

  get remainingCharacterCount() {
    return 2000 - (this.rejectReasonFormControl.value?.length || 0);
  }

  onSubmit() {
    if (this.approveFormControl.value === 'No' && !this.rejectReasonFormControl.value?.length) {
      this.errors.emit([
        { fieldId: 'reject-reason', message: 'You must explain why you cannot approve this request.' },
      ]);
      return;
    }
    this.errors.emit([]);
  }

  onCancel() {
    //
  }
}
