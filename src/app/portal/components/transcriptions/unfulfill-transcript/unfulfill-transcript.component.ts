import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { REASON_DISPLAY, UnfulfilledReason } from 'src/app/admin/utils/unfulfilled-transcript.utils';

@Component({
  selector: 'app-unfulfilled-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GovukTextareaComponent],
  templateUrl: './unfulfill-transcript.component.html',
  styleUrls: ['./unfulfill-transcript.component.scss'],
})
export class UnfullfillTranscriptComponent {
  @Input() reasonControl!: FormControl<UnfulfilledReason | '' | null>;
  @Input() detailsControl!: FormControl<string>;
  @Input() isSubmitted = false;
  @Input() maxDetailsLength = 200;

  @Input()
  errorMessageFor: (field: 'reason' | 'details', errors?: ValidationErrors | null) => string | null = () => null;

  @Output() reasonChanged = new EventEmitter<UnfulfilledReason | ''>();

  readonly REASON_DISPLAY = REASON_DISPLAY;
  readonly reasons = Object.keys(REASON_DISPLAY) as UnfulfilledReason[];

  handleReasonChange(): void {
    if (this.reasonControl?.value !== 'other') {
      this.detailsControl.setValue('', { emitEvent: false });
    }
    this.reasonChanged.emit(this.reasonControl?.value ?? '');
  }
}
