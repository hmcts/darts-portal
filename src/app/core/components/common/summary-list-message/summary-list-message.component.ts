import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-summary-list-message',
  imports: [],
  templateUrl: './summary-list-message.component.html',
  styleUrl: './summary-list-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryListMessageComponent {
  message = input.required<string>();
}
