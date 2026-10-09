import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-request-transcript-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './request-transcript-success.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./request-transcript-success.component.scss'],
})
export class RequestTranscriptSuccessComponent {
  @Input() transcriptRequestId!: number;
}
