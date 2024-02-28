import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorSummaryEntry } from '@core-types/index';

@Component({
  selector: 'app-edit-email-confirmation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-email-confirmation.component.html',
  styleUrl: './edit-email-confirmation.component.scss',
})
export class EditEmailConfirmationComponent {
  @Input() newEmail = '';
  @Input() oldEmail = '';
  @Output() confirm = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  destroyRef = inject(DestroyRef);

  formControl = new FormControl<boolean | null>(null, [Validators.required]);

  errorMessage = "Choose whether to change the user's email address";

  onSubmit() {
    this.formControl.markAsTouched();

    this.formControl.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status) => {
      if (status === 'INVALID') {
        this.errors.emit([{ fieldId: 'confirmChange', message: this.errorMessage }]);
      } else {
        this.errors.emit([]);
      }
    });

    if (this.formControl.invalid) {
      this.errors.emit([{ fieldId: 'confirmChange', message: this.errorMessage }]);
      return;
    }

    this.confirm.emit(!!this.formControl.value);
  }
}
