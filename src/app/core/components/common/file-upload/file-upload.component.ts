import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() id = '1';
  @Input() label = 'Upload file';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() isInvalid = false;
  @Input() allowedFileTypes = '.doc,.docx,.zip';

  controlId = `file-upload-${this.id}`;
  controlErrorId = `${this.controlId}-error`;

  // Implementing ControlValueAccessor interface boilerplate
  onChange: (value: File | null) => void = () => {};
  onTouched: () => void = () => {};

  onFileChange(files: File[]) {
    const file = files[0] || null;
    this.onChange(file);
    this.onTouched();
  }

  writeValue(): void {
    // no implementation required
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onFileRemove(fileInput: HTMLInputElement) {
    fileInput.value = '';
    this.onFileChange([]);
  }
}
