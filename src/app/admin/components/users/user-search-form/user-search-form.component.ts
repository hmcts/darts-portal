import { UserSearchFormValues } from '@admin-types/users/user-search-form-values.type';
import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  imports: [ReactiveFormsModule],
  templateUrl: './user-search-form.component.html',
  styleUrl: './user-search-form.component.scss',
})
export class UserSearchFormComponent implements OnInit {
  formValues = input.required<UserSearchFormValues>();

  @Output() submitForm = new EventEmitter<UserSearchFormValues>();
  @Output() clear = new EventEmitter<void>();

  fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      fullName: [this.formValues().fullName, [optionalMaxLengthValidator(255)]],
      email: [this.formValues().email, [optionalMaxLengthValidator(255)]],
      userStatus: this.formValues().userStatus,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  clearSearch() {
    this.form.reset({ email: null, fullName: null, userStatus: 'active' });
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
