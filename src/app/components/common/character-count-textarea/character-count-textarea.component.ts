import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-count-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './character-count-textarea.component.html',
  styleUrl: './character-count-textarea.component.scss',
})
export class CharacterCountTextareaComponent implements AfterViewChecked {
  @Input() control!: FormControl;
  @Input() maxCharacterLimit = 2000;
  @Input() rows = 5;
  @Input() id!: string;
  @Input() name!: string;
  @Input() ariaDescribedBy!: string;
  @Input() booleanErrorFunction?: (control: FormControl) => boolean;
  errors: boolean = false;

  get remainingCharacterCount() {
    return this.maxCharacterLimit - (this.control.value?.length ?? 0);
  }

  ngAfterViewChecked(): void {
    if (this.booleanErrorFunction) {
      this.errors = this.booleanErrorFunction(this.control);
    }
  }
}
