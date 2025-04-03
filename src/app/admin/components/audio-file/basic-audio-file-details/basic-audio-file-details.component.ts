import { AudioFile } from '@admin-types/index';
import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { AssociatedHearing } from '@admin-types/transformed-media/associated-hearing';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AssociatedCasesTableComponent } from '@common/associated-cases-table/associated-cases-table.component';
import { AssociatedHearingsTableComponent } from '@common/associated-hearings-table/associated-hearings-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { FileSizePipe } from '@pipes/file-size.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
@Component({
  selector: 'app-basic-audio-file-details',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    LuxonDatePipe,
    AssociatedCasesTableComponent,
    AssociatedHearingsTableComponent,
    FileSizePipe,
  ],
  templateUrl: './basic-audio-file-details.component.html',
  styleUrl: './basic-audio-file-details.component.scss',
})
export class BasicAudioFileDetailsComponent {
  url = inject(Router).url;

  cleanedUrl = this.getCleanedUrl();

  @Input() audioFile!: AudioFile;
  @Input() associatedCases: AssociatedCase[] = [];
  @Input() associatedHearings: AssociatedHearing[] = [];

  bytesInMb = 1024 * 1024;

  private getCleanedUrl(): string {
    return this.url.split('?')[0];
  }
}
