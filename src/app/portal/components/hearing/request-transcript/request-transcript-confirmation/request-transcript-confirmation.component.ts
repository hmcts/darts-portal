import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@components/common/govuk-textarea/govuk-textarea.component';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Case, Hearing, TranscriptionType, Urgency } from '@portal-types/index';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-request-transcript-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    JoinPipe,
    ReactiveFormsModule,
    GovukTextareaComponent,
    LuxonDatePipe,
    DetailsTableComponent,
    GovukHeadingComponent,
  ],
  templateUrl: './request-transcript-confirmation.component.html',
  styleUrls: ['./request-transcript-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTranscriptConfirmationComponent {
  @Input() case!: Case;
  @Input() hearing!: Hearing;
  @Input() urgencyId!: number;
  @Input() urgencies: Urgency[] = [];
  @Input() transcriptionTypeId!: number;
  @Input() transcriptionTypes: TranscriptionType[] = [];
  @Input() audioTimes?: { startTime: DateTime | null; endTime: DateTime | null };

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();
  @Output() errors = new EventEmitter<{ fieldId: string; message: string }[]>();

  moreDetailFormControl = new FormControl('');
  authorisationFormControl = new FormControl(false, [Validators.required]);

  isSubmitted = false;

  get urgency() {
    return this.urgencies.find((u) => u.transcription_urgency_id === this.urgencyId)?.description;
  }

  get transcriptionType() {
    return this.transcriptionTypes.find((t) => t.transcription_type_id === this.transcriptionTypeId)?.description;
  }

  get audioTimesString() {
    if (!this.audioTimes) {
      return '';
    }
    return `Start time ${this.audioTimes.startTime?.toFormat('HH:mm:ss')} - End time ${this.audioTimes.endTime?.toFormat('HH:mm:ss')}`;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.authorisationFormControl.value) {
      this.errors.emit([
        { fieldId: 'authorisation', message: 'You must confirm that you have authority to request a transcript' },
      ]);
      return;
    }
    this.errors.emit([]);

    this.confirm.emit(this.moreDetailFormControl.value ?? '');
  }

  onCancel() {
    this.cancel.emit();
  }
}
