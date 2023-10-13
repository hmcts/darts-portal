import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AudioService } from '@services/audio/audio.service';
import { Case } from '@darts-types/case.interface';
import { Hearing } from '@darts-types/hearing.interface';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';

@Component({
  selector: 'app-audio-view',
  standalone: true,
  imports: [CommonModule, RouterLink, ReportingRestrictionComponent],
  templateUrl: './audio-view.component.html',
  styleUrls: ['./audio-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioViewComponent {
  audioService = inject(AudioService);
  route = inject(ActivatedRoute);

  case!: Case;
  hearing!: Hearing;
  audio!: { id: number; startTime: string; endTime: string };

  constructor() {
    //Send request to update last accessed time of audio
    this.audioService.patchAudioRequest(this.route.snapshot.params.requestId).subscribe();
  }

  onDeleteClicked(event: MouseEvent) {
    event.preventDefault();
  }
}
