import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/case.interface';
import { DatatableColumn, UserAudioRequestRow } from '@darts-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CaseService } from '@services/case/case.service';
import { Observable } from 'rxjs';
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
    DataTableComponent,
    TableRowTemplateDirective,
    AudioPlayerComponent,
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

  columns: DatatableColumn[] = [
    { name: '', prop: '' },
    { name: 'Event type', prop: 'eventType', sortable: true },
    { name: 'Event time', prop: 'eventTime', sortable: true },
    { name: 'Audio file time', prop: 'audioTime', sortable: true },
  ];

  rows = [
    {
      eventType: 'Hearing Event - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, nesciunt. ',
      eventTime: '2021-08-23T09:00:00Z',
      audioTime: '2021-08-23T09:00:00Z',
    },
    { eventType: 'Hearing Event', eventTime: '2021-08-23T09:00:00Z', audioTime: '2021-08-23T09:00:00Z' },
    { eventType: 'Hearing Event', eventTime: '2021-08-23T09:00:00Z', audioTime: '2021-08-23T09:00:00Z' },
    { eventType: 'Hearing Event', eventTime: '2021-08-23T09:00:00Z', audioTime: '2021-08-23T09:00:00Z' },
    { eventType: 'Hearing Event', eventTime: '2021-08-23T09:00:00Z', audioTime: '2021-08-23T09:00:00Z' },
    { eventType: 'Hearing Event', eventTime: '2021-08-23T09:00:00Z', audioTime: '2021-08-23T09:00:00Z' },
  ];

  constructor() {
    this.audioRequest = this.audioRequestService.audioRequestView;

    if (!this.audioRequest) {
      this.router.navigate(['/audios']);
    }

    this.requestId = this.audioRequest.requestId;
    const isUnread = !this.audioRequest.lastAccessed;

    //Send request to update last accessed time of audio
    this.audioRequestService.patchAudioRequestLastAccess(this.requestId, isUnread).subscribe();

    this.case$ = this.caseService.getCase(this.audioRequest.caseId);

    this.downloadUrl = this.audioRequestService.getDownloadUrl(this.requestId);
    this.fileName = `${this.audioRequest.caseNumber}.zip`;
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
}
