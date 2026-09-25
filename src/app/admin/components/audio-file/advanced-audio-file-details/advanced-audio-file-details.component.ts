import { AudioFile } from '@admin-types/index';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-advanced-audio-file-details',
  standalone: true,
  imports: [GovukHeadingComponent, LuxonDatePipe, RouterLink],
  templateUrl: './advanced-audio-file-details.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './advanced-audio-file-details.component.scss',
})
export class AdvancedAudioFileDetailsComponent {
  @Input() audioFile!: AudioFile;
  @Input() isAdmin!: boolean;
}
