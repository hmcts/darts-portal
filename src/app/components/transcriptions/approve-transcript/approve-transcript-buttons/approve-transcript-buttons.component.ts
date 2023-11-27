import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-approve-transcript-buttons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApproveTranscriptButtonsComponent],
  templateUrl: './approve-transcript-buttons.component.html',
  styleUrl: './approve-transcript-buttons.component.scss',
})
export class ApproveTranscriptButtonsComponent {
  rejectReasonFormControl = new FormControl('');
  approveFormControl = new FormControl('');

  get remainingCharacterCount() {
    return 2000 - (this.rejectReasonFormControl.value?.length || 0);
  }

  onSubmit() {
    //
  }

  onCancel() {
    //
  }
}
