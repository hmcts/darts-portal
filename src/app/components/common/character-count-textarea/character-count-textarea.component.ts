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
  @Input() control!: FormControl;
  @Input() maxCharacterLimit = 2000;
  @Input() rows = 5;
  @Input() id!: string;
  @Input() name!: string;
  @Input() ariaDescribedBy!: string;

  get remainingCharacterCount() {
    return this.maxCharacterLimit - (this.control.value?.length ?? 0);
  }
}
