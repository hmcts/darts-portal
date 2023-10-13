import { combineLatest, Observable } from 'rxjs';
import { CaseService } from '@services/case/case.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { Case } from '@darts-types/case.interface';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { UserAudioRequestRow } from '@darts-types/index';

@Component({
  selector: 'app-audio-view',
  standalone: true,
  imports: [CommonModule, RouterLink, ReportingRestrictionComponent],
  templateUrl: './audio-view.component.html',
  styleUrls: ['./audio-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioViewComponent {
  audioRequestService = inject(AudioRequestService);
  caseService = inject(CaseService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  case$!: Observable<Case>;
  audioRequest!: UserAudioRequestRow;

  constructor() {
    this.audioRequest = this.audioRequestService.audioRequestView;

    if (!this.audioRequest) {
      this.router.navigate(['../']);
    }
    //Send request to update last accessed time of audio
    this.audioRequestService.patchAudioRequest(this.route.snapshot.params.requestId).subscribe();

    this.case$ = this.caseService.getCase(this.audioRequest.caseId);
  }

  onDeleteClicked(event: MouseEvent) {
    event.preventDefault();
  }

  onDownloadClicked() {
    this.audioRequestService.downloadAudio(this.route.snapshot.params.requestId).subscribe((data) => {
      console.log(data);
    });
  }
}
