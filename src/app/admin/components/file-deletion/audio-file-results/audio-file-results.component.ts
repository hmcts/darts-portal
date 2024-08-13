import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableBodyTemplateDirective } from '@directives/table-body-template.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-audio-file-results',
  standalone: true,
  imports: [
    DataTableComponent,
    TableBodyTemplateDirective,
    TableRowTemplateDirective,
    RouterLink,
    CommonModule,
    LuxonDatePipe,
  ],
  templateUrl: './audio-file-results.component.html',
  styleUrl: './audio-file-results.component.scss',
})
export class AudioFileResultsComponent {
  userService = inject(UserService);
  router = inject(Router);

  rows = input<AudioFileMarkedDeletion[]>([]);
  showDeleteButton = input(true);

  columns = computed<DatatableColumn[]>(() => {
    const columns = [
      { prop: 'mediaId', name: 'Audio ID' },
      { prop: 'courthouse', name: 'Courthouse' },
      { prop: 'hearingDate', name: 'Hearing date' },
      { prop: 'startTime', name: 'Start time' },
      { prop: 'endTime', name: 'End time' },
      { prop: 'courtroom', name: 'Courtroom' },
      { prop: 'channel', name: 'Channel' },
      { prop: 'markedByName', name: 'Marked by' },
      { prop: 'comments', name: 'Comments' },
    ];
    if (this.showDeleteButton()) {
      columns.push({ prop: '', name: '' });
    }
    return columns;
  });

  deleteAudioFile(audioFile: AudioFileMarkedDeletion): void {
    const audioFileStringified = this.stringifyDates(audioFile);
    const userPermitted = !this.userService.hasMatchingUserId(audioFile.hiddenById);

    this.router.navigate(['/admin/file-deletion/audio-file', audioFile.mediaId], {
      state: { isPermitted: userPermitted, file: audioFileStringified },
    });
  }

  //Required for reliably passing audio file through state
  private stringifyDates(audioFile: AudioFileMarkedDeletion) {
    return {
      ...audioFile,
      startAt: audioFile.startAt.toISOTime(),
      endAt: audioFile.endAt.toISOTime(),
    };
  }
}
