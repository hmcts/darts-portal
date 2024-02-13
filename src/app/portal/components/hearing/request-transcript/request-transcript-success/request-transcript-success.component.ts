import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-request-transcript-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './request-transcript-success.component.html',
  styleUrls: ['./request-transcript-success.component.scss'],
})
export class RequestTranscriptSuccessComponent {
  @Input() transcriptRequestId!: number;
}
