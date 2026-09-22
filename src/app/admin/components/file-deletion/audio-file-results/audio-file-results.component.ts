import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { Media } from '@admin-types/file-deletion/media.type';

import { Component, computed, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-audio-file-results',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink, LuxonDatePipe, GovukSummaryListDirectives],
  templateUrl: './audio-file-results.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './audio-file-results.component.scss',
})
export class AudioFileResultsComponent {
  approveScreen = input(false);

  userService = inject(UserService);
  router = inject(Router);

  rows = input<AudioFileMarkedDeletion[] | Media[]>([]);
  deletion = output<AudioFileMarkedDeletion>();

  showDeleteButton = input(true);

  columns = computed<DatatableColumn[]>(() => {
    const columns: DatatableColumn[] = this.approveScreen()
      ? [
          { prop: 'id', name: 'Audio ID' },
          { prop: 'channel', name: 'Channel' },
          { prop: 'totalChannels', name: 'Max channel' },
          { prop: 'isCurrent', name: 'Is current?' },
          { prop: 'versionCount', name: 'No. of versions' },
        ]
      : [
          { prop: 'courthouse', name: 'Courthouse' },
          { prop: 'courtroom', name: 'Courtroom' },
          { prop: 'startTime', name: 'Start time' },
          { prop: 'endTime', name: 'End time' },
          { prop: 'channel', name: 'No. of channels' },
          { prop: 'markedHiddenBy', name: 'Marked by' },
          { prop: 'comments', name: 'Comments' },
        ];

    if (this.showDeleteButton()) {
      columns.push({ prop: '', name: 'Delete' });
    }
    return columns;
  });

  getMediaRows(): Media[] {
    return this.rows() as Media[];
  }

  getAudioFileMarkedDeletionRows(): AudioFileMarkedDeletion[] {
    return this.rows() as AudioFileMarkedDeletion[];
  }

  deleteAudioFile(audioFile: AudioFileMarkedDeletion): void {
    this.deletion.emit(audioFile);
  }
}
