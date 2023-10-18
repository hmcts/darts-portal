import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/case.interface';
import { UserAudioRequestRow } from '@darts-types/index';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { Observable } from 'rxjs';

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
  downloadUrl = '';
  fileName = '';

  constructor() {
    this.audioRequest = this.audioRequestService.audioRequestView;
    const { requestId } = this.audioRequest;
    const isUnread = this.audioRequest.last_accessed_ts ? false : true;

    if (!this.audioRequest) {
      this.router.navigate(['../']);
    }

    //Send request to update last accessed time of audio
    this.audioRequestService.patchAudioRequestLastAccess(requestId, isUnread).subscribe();

    this.case$ = this.caseService.getCase(this.audioRequest.caseId);

    this.downloadUrl = this.audioRequestService.getDownloadUrl(requestId);
    this.fileName = `${this.audioRequest.caseNumber}.zip`;
  }

  onDeleteClicked(event: MouseEvent) {
    event.preventDefault();
  }
}
