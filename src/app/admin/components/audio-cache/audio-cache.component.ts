import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-audio-cache',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './audio-cache.component.html',
  styleUrl: './audio-cache.component.scss',
})
export class AudioCacheComponent {}
