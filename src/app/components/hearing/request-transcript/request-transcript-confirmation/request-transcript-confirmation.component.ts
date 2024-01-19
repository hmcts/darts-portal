import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CharacterCountTextareaComponent } from '@common/character-count-textarea/character-count-textarea.component';
import { Case } from '@darts-types/case.interface';
import { Hearing, TranscriptionType } from '@darts-types/index';
import { TranscriptionUrgency } from '@darts-types/transcription-urgency.interface';
import { JoinPipe } from '@pipes/join';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-request-transcript-confirmation',
  standalone: true,
  imports: [CommonModule, JoinPipe, ReactiveFormsModule, CharacterCountTextareaComponent],
  templateUrl: './request-transcript-confirmation.component.html',
  styleUrls: ['./request-transcript-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTranscriptConfirmationComponent {
  @Input() case!: Case;
  @Input() hearing!: Hearing;
  @Input() urgencyId!: number;
  @Input() urgencies: TranscriptionUrgency[] = [];
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
