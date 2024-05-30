import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-view-transcription-document',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './view-transcription-document.component.html',
  styleUrl: './view-transcription-document.component.scss',
})
export class ViewTranscriptionDocumentComponent {
  route = inject(ActivatedRoute);

  transcriptionDocumentId: string = this.route.snapshot.params.transcriptionDocumentId;
}
