import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { finalize } from 'rxjs';
import { AudioFileResultsComponent } from './audio-file-results/audio-file-results.component';

@Component({
  selector: 'app-file-deletion',
  standalone: true,
  imports: [GovukHeadingComponent, TabsComponent, TabDirective, AudioFileResultsComponent, LoadingComponent],
  templateUrl: './file-deletion.component.html',
  styleUrl: './file-deletion.component.scss',
})
export class FileDeletionComponent {
  fileDeletionService = inject(FileDeletionService);

  isLoading = signal(true);

  audioFiles = toSignal(
    this.fileDeletionService.getAudioFilesMarkedForDeletion().pipe(finalize(() => this.isLoading.set(false))),
    { initialValue: [] }
  );

  audioCount = computed(() => (this.audioFiles().length > 0 ? this.audioFiles().length : 0));
}
