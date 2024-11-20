import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Component, EventEmitter, OnInit, Output, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormErrorMessages } from '@core-types/index';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';

const controlErrors: FormErrorMessages = {
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
export class CourthouseSearchFormComponent implements OnInit {
  formValues = input.required<CourthouseSearchFormValues>();
  @Output() submitForm = new EventEmitter<CourthouseSearchFormValues>();
  @Output() clear = new EventEmitter<void>();

  fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      courthouseName: [this.formValues().courthouseName, [optionalMaxLengthValidator(256)]],
      displayName: [this.formValues().displayName, [optionalMaxLengthValidator(256)]],
      region: [this.formValues().region, [optionalMaxLengthValidator(256)]],
    });
  }

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
    this.form.reset();
    this.clear.emit();
  }
}
