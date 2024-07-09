import { AudioFile } from '@admin-types/index';
import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { BytesPipe } from '@pipes/bytes.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AssociatedCasesTableComponent } from '../associated-cases-table/associated-cases-table.component';

@Component({
  selector: 'app-basic-audio-file-details',
  standalone: true,
  imports: [GovukHeadingComponent, BytesPipe, DecimalPipe, LuxonDatePipe, JsonPipe, AssociatedCasesTableComponent],
  templateUrl: './basic-audio-file-details.component.html',
  styleUrl: './basic-audio-file-details.component.scss',
})
export class BasicAudioFileDetailsComponent {
  @Input() audioFile!: AudioFile;
  @Input() associatedCases: AssociatedCase[] = [];

  bytesInMb = 1024 * 1024;
}
