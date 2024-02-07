import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-validation-error-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './validation-error-summary.component.html',
  styleUrls: ['./validation-error-summary.component.scss'],
})
export class ValidationErrorSummaryComponent {
  @Input() errors: { fieldId: string; message: string }[] = [];
}
