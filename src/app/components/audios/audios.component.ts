import { DataTableComponent } from '@common/data-table/data-table.component';
import { Component, inject } from '@angular/core';
import { TabsComponent } from '@common/tabs/tabs.component';
import { AudioService } from '@services/audio/audio.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { UserAudioRequest } from '@darts-types/user-audio-request.interface';
import { TableRowTemplateDirective } from 'src/app/directives/table-row-template.directive';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabDirective } from 'src/app/directives/tab.directive';
import { UserAudioRequestRow } from '@darts-types/index';
import { UnreadIconDirective } from '@directives/unread-icon.directive';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-audios',
  templateUrl: './audios.component.html',
  styleUrls: ['./audios.component.scss'],
  standalone: true,
  imports: [
    DataTableComponent,
    LoadingComponent,
    TabsComponent,
    CommonModule,
    TableRowTemplateDirective,
    UnreadIconDirective,
    RouterLink,
    TabDirective,
  ],
})
export class AudiosComponent {
  headerService = inject(HeaderService);
  audioService = inject(AudioService);
  datePipe = inject(DatePipe);

  userId: number;

  audioRequests$: Observable<UserAudioRequest[]>;
  expiredAudioRequests$: Observable<UserAudioRequest[]>;

  inProgessRows$!: Observable<UserAudioRequestRow[]>;
  completedRows$!: Observable<UserAudioRequestRow[]>;
  expiredRows$!: Observable<UserAudioRequestRow[]>;

  data$: Observable<{
    inProgessRows: UserAudioRequestRow[];
    completedRows: UserAudioRequestRow[];
    expiredRows: UserAudioRequestRow[];
  }>;

  columns = [
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Court', prop: 'courthouse', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Start time', prop: 'startTime', sortable: true },
    { name: 'End time', prop: 'endTime', sortable: true },
    { name: 'Request ID', prop: 'requestId', sortable: true },
    { name: 'Expiry date', prop: 'expiry', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
  ];

  readyColumns = [{}, ...this.columns]; //Empty column for unread icon

  constructor(private route: ActivatedRoute) {
    this.userId = this.route.snapshot.data.userState.userId;

    //Same data used for in progress & completed tables so share replay
    this.audioRequests$ = this.audioService.audioRequests$.pipe(shareReplay(1));
    this.expiredAudioRequests$ = this.audioService.expiredAudioRequests$;
    
    this.inProgessRows$ = this.audioRequests$.pipe(
      map((audioRequests) => this.filterInProgressRequests(audioRequests)),
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );
    this.completedRows$ = this.audioRequests$.pipe(
      map((audioRequests) => this.filterCompletedRequests(audioRequests)),
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );
    this.expiredRows$ = this.expiredAudioRequests$.pipe(
      map((audioRequests) => this.mapAudioRequestToRows(audioRequests))
    );

    this.data$ = combineLatest({
      inProgessRows: this.inProgessRows$,
      completedRows: this.completedRows$,
      expiredRows: this.expiredRows$,
    });
  }

  mapAudioRequestToRows(audioRequests: UserAudioRequest[]): UserAudioRequestRow[] {
    return audioRequests.map((ar) => {
      return {
        // id: ar.case_id,
        caseNumber: ar.case_number,
        courthouse: ar.courthouse_name,
        hearingDate: this.datePipe.transform(ar.hearing_date, 'dd MMM yyyy'),
        startTime: this.datePipe.transform(ar.media_request_start_ts, 'hh:mm:ss', 'utc'),
        endTime: this.datePipe.transform(ar.media_request_end_ts, 'hh:mm:ss', 'utc'),
        requestId: ar.media_request_id,
        expiry: this.datePipe.transform(ar.media_request_expiry_ts, 'hh:mm:ss dd/mm/yyyy', 'utc'),
        status: ar.media_request_status,
        last_accessed_ts: ar.last_accessed_ts,
      };
    });
  }

  filterInProgressRequests(audioRequests: UserAudioRequest[]): UserAudioRequest[] {
    return audioRequests.filter(
      (ar) =>
        ar.media_request_status === 'OPEN' ||
        ar.media_request_status === 'PROCESSING' ||
        ar.media_request_status === 'FAILED'
    );
  }

  filterCompletedRequests(audioRequests: UserAudioRequest[]): UserAudioRequest[] {
    return audioRequests.filter((ar) => ar.media_request_status === 'COMPLETED');
  }
}
