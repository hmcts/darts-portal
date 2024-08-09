import { UserSearchFormValues } from '@admin-types/users/user-search-form-values.type';
import { JsonPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormErrorMessages } from '@core-types/index';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';

const controlErrors: FormErrorMessages = {
  fullName: {
    maxlength: 'Must be less than 256 characters',
  },
  email: {
    maxlength: 'Must be less than 256 characters',
  },
};
@Component({
  selector: 'app-user-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgClass],
  templateUrl: './user-search-form.component.html',
  styleUrl: './user-search-form.component.scss',
})
export class UserSearchFormComponent {
  @Output() submitForm = new EventEmitter<UserSearchFormValues>();
  @Output() clear = new EventEmitter<void>();

  formDefaultValues: UserSearchFormValues = { fullName: null, email: null, userStatus: 'active' };

  fb = inject(FormBuilder);

  form = this.fb.group({
    fullName: [this.formDefaultValues.fullName, [optionalMaxLengthValidator(256)]],
    email: [this.formDefaultValues.email, [optionalMaxLengthValidator(256)]],
    userStatus: this.formDefaultValues.userStatus,
  });

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  clearSearch() {
    this.form.reset(this.formDefaultValues);
    this.clear.emit();
  }

  getFormControlErrorMessages(controlName: string): string[] {
    const errors = this.form.get(controlName)?.errors;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map((error) => controlErrors[controlName][error]);
  }

  get fullNameControl() {
    return this.form.get('fullName')!;
  }

  get emailControl() {
    return this.form.get('email')!;
  }
}
