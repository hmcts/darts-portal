import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormErrorMessages } from '@core-types/index';

const controlErrors: FormErrorMessages = {
  deletionApproval: {
    required: 'Select your decision',
  },
};

@Component({
  selector: 'app-approve-reject-file-delete',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './approve-reject-file-delete.component.html',
  styleUrl: './approve-reject-file-delete.component.scss',
})
export class ApproveRejectFileDeleteComponent {
  deletionApproval = new FormControl<boolean | null>(null, [Validators.required]);

  confirmation = output<boolean>();
  errors = output<string[]>();

  getApprovalChoiceErrors(): string[] {
    return this.deletionApproval.errors?.length > 0 || this.deletionApproval.touched
      ? Object.keys(this.deletionApproval.errors || {}).map((error) => controlErrors['deletionApproval'][error])
      : [];
  }

  confirm() {
    this.deletionApproval.markAllAsTouched();
    if (!this.deletionApproval.valid) {
      this.errors.emit(this.getApprovalChoiceErrors());
      return;
    } else {
      this.confirmation.emit(this.deletionApproval.value ?? false);
    }
  }
}
