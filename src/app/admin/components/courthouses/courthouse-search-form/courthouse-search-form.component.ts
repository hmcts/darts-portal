import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FieldErrors } from '@core-types/index';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';

const controlErrors: FieldErrors = {
  courthouseName: {
    maxlength: 'Must be less than 256 characters',
  },
  displayName: {
    maxlength: 'Must be less than 256 characters',
  },
  region: {
    maxlength: 'Must be less than 256 characters',
  },
};
@Component({
  selector: 'app-courthouse-search-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './courthouse-search-form.component.html',
  styleUrl: './courthouse-search-form.component.scss',
})
export class CourthouseSearchFormComponent {
  @Output() submitForm = new EventEmitter<CourthouseSearchFormValues>();
  @Output() clear = new EventEmitter<void>();

  formDefaultValues: CourthouseSearchFormValues = { courthouseName: null, displayName: null, region: null };

  fb = inject(FormBuilder);

  form = this.fb.group({
    courthouseName: [this.formDefaultValues.courthouseName, [optionalMaxLengthValidator(256)]],
    displayName: [this.formDefaultValues.displayName, [optionalMaxLengthValidator(256)]],
    region: [this.formDefaultValues.region, [optionalMaxLengthValidator(256)]],
  });

  getFormControlErrorMessages(controlName: string): string[] {
    const errors = this.form.get(controlName)?.errors;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map((error) => controlErrors[controlName][error]);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  clearSearch() {
    this.form.reset(this.formDefaultValues);
    this.clear.emit();
  }
}
