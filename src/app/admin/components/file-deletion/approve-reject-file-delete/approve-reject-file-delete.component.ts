import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormErrorMessages } from '@core-types/index';

const controlErrors: FormErrorMessages = {
  deletionApproval: {
    required: 'Select your decision',
  },
  authorisationCheckbox: {
    required:
      'You must confirm that you have reviewed all versions and understand that all versions of the listed audio file(s) will be deleted',
  },
};

@Component({
  selector: 'app-approve-reject-file-delete',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './approve-reject-file-delete.component.html',
  styleUrl: './approve-reject-file-delete.component.scss',
})
export class ApproveRejectFileDeleteComponent implements OnInit {
  confirmation = output<boolean>();
  errors = output<{ fieldId: string; message: string }[]>();

  screen = input('transcript');

  deletionApproval = new FormControl<boolean | null>(null, [Validators.required]);
  authorisationCheckbox: FormControl<boolean | null> | null = null;

  ngOnInit(): void {
    if (this.screen() === 'audio') {
      this.authorisationCheckbox = new FormControl<boolean | null>(null, [Validators.required]);
    }
  }

  getApprovalChoiceErrors(): string[] {
    const approvalErrors =
      this.deletionApproval.errors?.length > 0 || this.deletionApproval.touched
        ? Object.keys(this.deletionApproval.errors || {}).map((error) => controlErrors['deletionApproval'][error])
        : [];

    const authorisationErrors =
      this.authorisationCheckbox?.errors?.length > 0 || this.authorisationCheckbox?.touched
        ? Object.keys(this.authorisationCheckbox?.errors || {}).map(
            (error) => controlErrors['authorisationCheckbox'][error]
          )
        : [];

    return [...approvalErrors, ...authorisationErrors];
  }

  getErrorMessages(controlKey: 'deletionApproval' | 'authorisationCheckbox'): string[] {
    const control = this[controlKey] as FormControl;

    if (!control || !control.errors || !control.touched) {
      return [];
    }

    return Object.keys(control.errors).map((errorKey) => controlErrors[controlKey][errorKey]);
  }

  getErrorSummary(): { fieldId: string; message: string }[] {
    const errorSummary = [];

    if (this.authorisationCheckbox?.errors?.length > 0 || this.authorisationCheckbox?.touched) {
      errorSummary.push({
        fieldId: 'authorisationCheckbox',
        message: this.getErrorMessages('authorisationCheckbox').join(''),
      });
    }

    if (this.deletionApproval.errors?.length > 0 || this.deletionApproval.touched) {
      errorSummary.push({
        fieldId: 'deletionApproval',
        message: this.getErrorMessages('deletionApproval').join(''),
      });
    }

    return errorSummary;
  }

  confirm() {
    this.deletionApproval.markAllAsTouched();

    if (this.screen() === 'audio') {
      this.authorisationCheckbox?.markAllAsTouched();
    }

    console.log(this.authorisationCheckbox?.valid);
    console.log(this.authorisationCheckbox?.errors);

    if (!this.deletionApproval.valid || (this.screen() === 'audio' && !this.authorisationCheckbox?.valid)) {
      this.errors.emit(this.getErrorSummary());
      return;
    } else {
      this.confirmation.emit(this.deletionApproval.value ?? false);
    }
  }
}
