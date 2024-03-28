import { GroupFormValue } from '@admin-types/groups/security-group-form-values.type';
import { SecurityGroup } from '@admin-types/index';
import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorSummaryEntry, FieldErrors } from '@core-types/index';
import { groupNameExistsValidator } from '@validators/group-name.validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';

const formControlErrorMessages: FieldErrors = {
  name: {
    required: 'Enter a group name',
    groupNameExists: 'There is an existing group with this name',
  },
  description: {
    maxlength: 'Description must be less than 255 characters',
  },
  role: {
    required: 'Select a role',
  },
};

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.scss',
})
export class GroupFormComponent implements OnInit {
  @Input() group: SecurityGroup | null = null;
  @Input() allGroups: SecurityGroup[] = [];
  @Output() saveGroup = new EventEmitter<GroupFormValue>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  fb = inject(FormBuilder);
  formDefaults!: GroupFormValue;
  form!: FormGroup;
  isEdit = false;

  ngOnInit(): void {
    if (this.group) {
      this.isEdit = true;
    }

    this.formDefaults = {
      name: this.group?.name ?? null,
      description: this.group?.description ?? null,
      role: this.group?.role?.name ?? null,
    };

    this.form = this.fb.group({
      name: this.fb.control(this.formDefaults.name, [
        Validators.required,
        groupNameExistsValidator(this.allGroups, this.formDefaults.name ?? ''),
      ]),
      description: this.fb.control(this.formDefaults.description, [optionalMaxLengthValidator(255)]),
      role: this.fb.control(this.formDefaults.role, this.isEdit ? [] : [Validators.required]),
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.saveGroup.emit(this.form.value);
      return;
    }
    this.emitErrorSummary();
  }

  onCancel() {
    this.cancel.emit();
  }

  getFormControlErrorMessages(controlName: string): string[] {
    const errors = this.form.get(controlName)?.errors;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map((error) => formControlErrorMessages[controlName][error]);
  }

  isControlInvalid(controlName: string): boolean {
    return !!this.form.get(controlName)?.errors && !!this.form.get(controlName)?.touched;
  }

  emitErrorSummary() {
    const errors: ErrorSummaryEntry[] = [];

    Object.keys(this.form.controls).forEach((controlName) => {
      this.getFormControlErrorMessages(controlName).forEach((message) => {
        errors.push({
          fieldId: controlName,
          message,
        });
      });
    });

    this.errors.emit(errors);
  }
}
