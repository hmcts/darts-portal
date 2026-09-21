import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-validation-error-summary',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './validation-error-summary.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./validation-error-summary.component.scss'],
})
export class ValidationErrorSummaryComponent {
  @Input() errors: { fieldId: string; message: string }[] = [];
}
