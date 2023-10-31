import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { JoinPipe } from '@pipes/join';
import { LoadingComponent } from '@common/loading/loading.component';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { HearingService } from '@services/hearing/hearing.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AudioEventRow, DatatableColumn, HearingAudio } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';

@Component({
  selector: 'app-request-transcript',
  standalone: true,
  imports: [
    CommonModule,
    ReportingRestrictionComponent,
    DataTableComponent,
    JoinPipe,
    LoadingComponent,
    TableRowTemplateDirective,
    RouterLink,
  ],
  templateUrl: './request-transcript.component.html',
  styleUrls: ['./request-transcript.component.scss'],
})
export class RequestTranscriptComponent implements OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      this.headerService.hideNavigation();
    }, 0);
  }
  route = inject(ActivatedRoute);
  caseService = inject(CaseService);
  hearingService = inject(HearingService);
  headerService = inject(HeaderService);

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;

  case$ = this.caseService.getCase(this.caseId);
  hearing$ = this.caseService.getHearingById(this.caseId, this.hearingId);
  audio$ = this.hearingService.getAudio(this.hearingId);

  data$ = combineLatest({
    case: this.case$,
    hearing: this.hearing$,
    audios: this.audio$,
  });

  transcriptRequestColumns: DatatableColumn[] = [
    { name: 'Start Time', prop: 'media_start_timestamp', sortable: true },
    { name: 'End Time', prop: 'media_end_timestamp', sortable: true },
    { name: '', prop: 'event' },
  ];

  public mapEventsAndAudioToTable(audio: HearingAudio[]): AudioEventRow[] {
    const rows = [
      ...audio.map((audio) => ({
        ...audio,
        timestamp: audio.media_start_timestamp,
        event: 'Audio Recording',
      })),
    ];

    return rows;
  }
}
