import { CreateUpdateUserFormValues } from '@admin-types/index';
import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorSummaryEntry, FieldErrors } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { emailExistsValidator } from '@validators/email-exists.validator';

const controlErrors: FieldErrors = {
  fullName: {
    required: 'Enter full name',
  },
  email: {
    required: 'Enter email',
    email: 'Enter a valid email address',
    emailExists: 'This email account already exists in the database',
  },
  description: {},
};

@Component({
  selector: 'app-create-update-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './create-update-user-form.component.html',
  styleUrl: './create-update-user-form.component.scss',
})
export class CreateUpdateUserFormComponent {
  @Output() submitForm = new EventEmitter<CreateUpdateUserFormValues>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  formDefaultValues: CreateUpdateUserFormValues = { fullName: null, email: null, description: null };

  fb = inject(FormBuilder);
  formService = inject(FormService);

  form = this.fb.group({
    fullName: [this.formDefaultValues.fullName, Validators.required],
    email: [this.formDefaultValues.email, [Validators.required, Validators.email], [emailExistsValidator()]],
    description: this.formDefaultValues.description,
  });

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => {
        this.errors.emit(this.formService.getErrorSummary(this.form, controlErrors));
      });
      this.form.updateValueAndValidity();
      return;
    }

    this.errors.emit([]);
    this.submitForm.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }

  getFormControlErrorMessages(controlName: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlName, controlErrors);
  }

  isControlInvalid(control: AbstractControl) {
    return control.errors && control.touched;
  }

  get fullNameControl() {
    return this.form.get('fullName')!;
  }

  get emailControl() {
    return this.form.get('email')!;
  }

  get descriptionControl() {
    return this.form.get('description')!;
  }
}
function takeUntilDestroyed(): import('rxjs').OperatorFunction<import('@angular/forms').FormControlStatus, unknown> {
  throw new Error('Function not implemented.');
}
