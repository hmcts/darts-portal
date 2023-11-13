import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-request-transcript-exists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './request-transcript-exists.component.html',
  styleUrls: ['./request-transcript-exists.component.scss'],
})
export class RequestTranscriptExistsComponent {
  @Input() transcriptionId: number | undefined;
  route = inject(ActivatedRoute);

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;
}
