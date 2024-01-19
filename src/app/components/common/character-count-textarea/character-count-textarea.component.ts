import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-count-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './character-count-textarea.component.html',
  styleUrl: './character-count-textarea.component.scss',
})
export class CharacterCountTextareaComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() maxCharacterLimit = 2000;
  @Input() rows = 5;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) ariaDescribedBy!: string;
  @Input() isInvalid: boolean = false;

  get remainingCharacterCount() {
    return this.maxCharacterLimit - (this.control.value?.length ?? 0);
  }
}
