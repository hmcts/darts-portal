import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/case.interface';
import { ErrorMessage } from '@darts-types/error-message.interface';
import { UserAudioRequestRow } from '@darts-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { Observable, combineLatest } from 'rxjs';
import { AudioDeleteComponent } from '../audio-delete/audio-delete.component';

@Component({
  selector: 'app-audio-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReportingRestrictionComponent,
    AudioDeleteComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
  ],
  templateUrl: './audio-view.component.html',
  styleUrls: ['./audio-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioViewComponent implements OnDestroy {
  audioRequestService = inject(AudioRequestService);
  caseService = inject(CaseService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  case$!: Observable<Case>;
  audioRequest: UserAudioRequestRow | null = null;
  downloadUrl = '';
  fileName = '';
  isDeleting = false;
  requestId: number | undefined;

  error$ = this.errorMsgService.errorMessage$;
  data$:
    | Observable<{
        case: Case;
        error: ErrorMessage | null;
      }>
    | undefined;

  permissionErrors = [
    'You do not have permission to view this file',
    'Email crownITsupport@justice.gov.uk to request access',
  ];

  constructor(private errorMsgService: ErrorMessageService) {
    this.audioRequest = this.audioRequestService.audioRequestView;

    if (!this.audioRequest) {
      this.router.navigate(['/audios']);
    } else {
      this.requestId = this.audioRequest.requestId;
      const isUnread = !this.audioRequest.last_accessed_ts;

      //Send request to update last accessed time of audio
      this.audioRequestService.patchAudioRequestLastAccess(this.requestId, isUnread).subscribe();

      this.case$ = this.caseService.getCase(this.audioRequest.caseId);
      this.fileName = `${this.audioRequest.caseNumber}.zip`;

      this.data$ = combineLatest({
        case: this.case$,
        error: this.error$,
      });
    }
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }

  onDeleteConfirmed() {
    this.requestId &&
      this.audioRequestService.deleteAudioRequests(this.requestId).subscribe({
        next: () => {
          this.router.navigate(['/audios']);
          return;
        },
        error: () => (this.isDeleting = false),
      });
  }

  onDownloadClicked() {
    this.audioRequestService.downloadAudio(this.route.snapshot.params.requestId).subscribe({
      next: (blob: Blob) => {
        this.saveAs(blob, `${this.audioRequest?.caseNumber.toString()}.zip`);
      },
    });
  }

  private saveAs(blob: Blob, fileName: string) {
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(downloadLink);
  }
}
