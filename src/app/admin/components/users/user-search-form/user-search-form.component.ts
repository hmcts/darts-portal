import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserSearchFormValues } from '../../../models/users/user-search-form-values.type';

@Component({
  selector: 'app-user-search-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-search-form.component.html',
  styleUrl: './user-search-form.component.scss',
})
export class UserSearchFormComponent {
  @Output() submitForm = new EventEmitter<UserSearchFormValues>();
  @Output() clear = new EventEmitter<void>();

  formDefaultValues: UserSearchFormValues = { fullName: '', email: '', userStatus: 'active' };
  fb = inject(FormBuilder);
  form = this.fb.group<UserSearchFormValues>(this.formDefaultValues);

  onSubmit() {
    this.submitForm.emit(this.form.value);
  }

  clearSearch() {
    this.form.reset(this.formDefaultValues);
    this.clear.emit();
  }
}
