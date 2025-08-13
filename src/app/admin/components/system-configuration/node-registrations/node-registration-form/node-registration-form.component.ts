import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-node-registration-form',
  imports: [ReactiveFormsModule],
  templateUrl: './node-registration-form.component.html',
  styleUrl: './node-registration-form.component.scss',
})
export class NodeRegistrationFormComponent {
  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    courthouse: [''],
  });

  courthouseFilter = output<string>();

  onChange(): void {
    const value = this.form.value.courthouse?.trim().toLowerCase() ?? '';
    this.courthouseFilter.emit(value);
  }
}
