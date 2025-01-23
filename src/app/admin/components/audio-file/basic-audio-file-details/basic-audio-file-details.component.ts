import { AudioFile } from '@admin-types/index';
import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { AssociatedHearing } from '@admin-types/transformed-media/associated-hearing';
import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { BytesPipe } from '@pipes/bytes.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AssociatedCasesTableComponent } from '../associated-cases-table/associated-cases-table.component';
import { AssociatedHearingsTableComponent } from '../associated-hearings-table/associated-hearings-table.component';

@Component({
  selector: 'app-basic-audio-file-details',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    BytesPipe,
    DecimalPipe,
    LuxonDatePipe,
    AssociatedCasesTableComponent,
    AssociatedHearingsTableComponent,
  ],
  templateUrl: './basic-audio-file-details.component.html',
  styleUrl: './basic-audio-file-details.component.scss',
})
export class BasicAudioFileDetailsComponent {
  @Input() audioFile!: AudioFile;
  @Input() associatedCases: AssociatedCase[] = [];
  @Input() associatedHearings: AssociatedHearing[] = [];

  bytesInMb = 1024 * 1024;
}
