import { CreateUpdateUserFormValues } from '@admin-types/index';
import { NgFor } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorSummaryEntry, FieldErrors } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { emailExistsValidator } from '@validators/email-exists.validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';

const controlErrors: FieldErrors = {
  fullName: {
    required: 'Enter a full name',
  },
  email: {
    required: 'Enter an email address',
    email: 'Enter an email address in the correct format, like name@example.com',
    emailExists: 'Enter a unique email address',
  },
  description: {
    maxlength: 'Enter a description shorter than 256 characters',
  },
};

@Component({
  selector: 'app-create-update-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './create-update-user-form.component.html',
  styleUrl: './create-update-user-form.component.scss',
})
export class CreateUpdateUserFormComponent implements OnInit {
  @Output() submitForm = new EventEmitter<CreateUpdateUserFormValues>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  @Input() updateUser: CreateUpdateUserFormValues | null = null;

  formDefaultValues: CreateUpdateUserFormValues = { fullName: null, email: null, description: null };
  emailExistsValidator = emailExistsValidator();

  fb = inject(FormBuilder);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);

  form = this.fb.group({
    fullName: [this.formDefaultValues.fullName, Validators.required],
    email: [this.formDefaultValues.email, [Validators.required, Validators.email], [this.emailExistsValidator]],
    description: [this.formDefaultValues.description, [optionalMaxLengthValidator(256)]],
  });

  ngOnInit(): void {
    if (this.updateUser) {
      this.form.setValue({
        fullName: this.updateUser.fullName,
        email: this.updateUser.email,
        description: this.updateUser.description ?? null,
      });

      this.form.markAllAsTouched();

      this.setEmailUpdateValidation();

      this.form.updateValueAndValidity();
    }
  }

  private setEmailUpdateValidation() {
    const emailControl = this.form.get('email')!;

    emailControl.setAsyncValidators([]);

    emailControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newEmail) => {
      if (newEmail === this.updateUser?.email) {
        // Remove the email exists validator when updating a user and the email has not changed
        emailControl.setAsyncValidators([]);
      } else {
        // Add the email exists validator when updating a user and the email has changed
        emailControl.setAsyncValidators([this.emailExistsValidator]);
      }
      this.emailControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.errors.emit(this.formService.getErrorSummary(this.form, controlErrors));
      });
      this.form.updateValueAndValidity();
      return;
    }

    this.errors.emit([]);
    this.submitForm.emit(this.form.value as CreateUpdateUserFormValues);
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
