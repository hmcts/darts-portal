import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/case.interface';
import { UserAudioRequestRow } from '@darts-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
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
export class AudioViewComponent {
  audioRequestService = inject(AudioRequestService);
  caseService = inject(CaseService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  case$!: Observable<Case>;
  audioRequest!: UserAudioRequestRow;
  downloadUrl = '';
  fileName = '';
  isDeleting = false;
  requestId: number;

  //Move to centralised Error Message Service
  private errorCode: BehaviorSubject<number> = new BehaviorSubject<number>(200);
  readonly errorCode$: Observable<number> = this.errorCode.asObservable();
  data$: Observable<{
    case: Case;
    errorCode: number;
  }>;

  permissionErrors = [
    'You do not have permission to view this file',
    'Email crownITsupport@justice.gov.uk to request access',
  ];

  constructor() {
    this.audioRequest = this.audioRequestService.audioRequestView;

    if (!this.audioRequest) {
      this.router.navigate(['/audios']);
    }

    this.requestId = this.audioRequest.requestId;
    const isUnread = !this.audioRequest.last_accessed_ts;

    //Send request to update last accessed time of audio
    this.audioRequestService.patchAudioRequestLastAccess(this.requestId, isUnread).subscribe();

    this.case$ = this.caseService.getCase(this.audioRequest.caseId);
    this.fileName = `${this.audioRequest.caseNumber}.zip`;

    this.data$ = combineLatest({
      case: this.case$,
      errorCode: this.errorCode$,
    });
  }

  onDeleteConfirmed() {
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
        this.saveAs(blob, `${this.audioRequest.caseNumber.toString()}.zip`);
      },
      error: (error: HttpErrorResponse) => {
        this.errorCode.next(error.status);
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
