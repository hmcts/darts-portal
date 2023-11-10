import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { DatatableColumn, UserTranscriptionRequest } from '@darts-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { combineLatest, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-transcriptions',
  templateUrl: './transcriptions.component.html',
  styleUrls: ['./transcriptions.component.scss'],
  standalone: true,
  imports: [
    DataTableComponent,
    LoadingComponent,
    TabsComponent,
    CommonModule,
    TableRowTemplateDirective,
    RouterLink,
    TabDirective,
  ],
})
export class TranscriptionsComponent {
  transcriptService = inject(TranscriptionService);
  transcriptStatusClassMap = transcriptStatusClassMap;

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number', sortable: true },
    { name: 'Court', prop: 'courthouse_name', sortable: true },
    { name: 'Hearing date', prop: 'hearing_date', sortable: true },
    { name: 'Type', prop: 'transcription_type', sortable: true },
    { name: 'Requested on', prop: 'requested_ts', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
    { name: 'Urgency', prop: 'urgency', sortable: true },
  ];

  readyColumns = [...this.columns, { name: '', prop: '' }]; //Empty column header for view link

  requests$ = this.transcriptService.getTranscriptionRequests().pipe(shareReplay(1));

  data$ = combineLatest({
    inProgessRequests: this.requests$.pipe(
      map((requests) => this.filterInProgressRequests(requests.requester_transcriptions))
    ),
    completedRequests: this.requests$.pipe(
      map((requests) => this.filterReadyRequests(requests.requester_transcriptions))
    ),
  });

  filterInProgressRequests(requests: UserTranscriptionRequest[]): UserTranscriptionRequest[] {
    return requests.filter((r) => r.status === 'Awaiting Authorisation' || r.status === 'With Transcriber');
  }

  filterReadyRequests(requests: UserTranscriptionRequest[]): UserTranscriptionRequest[] {
    return requests.filter((r) => r.status === 'Complete' || r.status === 'Rejected');
  }
}
