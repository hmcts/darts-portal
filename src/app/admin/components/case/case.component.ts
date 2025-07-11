import { CaseAudio, PaginatedCaseAudio } from '@admin-types/case/case-audio/case-audio.type';
import { AdminCase } from '@admin-types/case/case.type';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import {
  AdminCaseEventSortBy,
  CaseEventsTableComponent,
} from '@components/case/case-file/case-events-table/case-events-table.component';
import { CaseHearingsTableComponent } from '@components/case/case-file/case-hearings-table/case-hearings-table.component';
import { TabDirective } from '@directives/tab.directive';
import { CaseEvent } from '@portal-types/events';
import { Hearing } from '@portal-types/hearing';
import { TranscriptsRow } from '@portal-types/transcriptions';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CaseAudioLoaderService } from '@services/case-audio-loader/case-audio-loader.service';
import { CaseEventsLoaderService } from '@services/case-events-loader/case-events-loader.service';
import { CaseService } from '@services/case/case.service';
import { HistoryService } from '@services/history/history.service';
import { MappingService } from '@services/mapping/mapping.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { CaseTranscriptsTableComponent } from '../../../portal/components/case/case-file/case-transcripts-table/case-transcripts-table.component';
import { CaseAdditionalDetailsComponent } from './case-file/case-additional-details/case-additional-details.component';
import { CaseAudioComponent, CaseAudioSortBy } from './case-file/case-audio/case-audio.component';
import { CaseFileComponent } from './case-file/case-file.component';

@Component({
  selector: 'app-case',
  imports: [
    CaseFileComponent,
    RouterLink,
    LoadingComponent,
    AsyncPipe,
    TabsComponent,
    TabDirective,
    CaseAdditionalDetailsComponent,
    GovukHeadingComponent,
    CaseHearingsTableComponent,
    CaseTranscriptsTableComponent,
    CaseEventsTableComponent,
    CaseAudioComponent,
  ],
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
})
export class CaseComponent implements OnInit {
  private readonly activeTabKey = 'admin-case-details';

  readonly tabNames = {
    hearings: 'Hearings',
    events: 'Events',
    transcripts: 'Transcripts',
    additional: 'Additional case details',
    audio: 'Audio',
  } as const;

  caseService = inject(CaseService);
  mappingService = inject(MappingService);
  caseEventsLoader = inject(CaseEventsLoaderService);
  caseAudioLoader = inject(CaseAudioLoaderService);
  userAdminService = inject(UserAdminService);
  caseAdminService = inject(AdminCaseService);
  historyService = inject(HistoryService);
  appConfig = inject(AppConfigService);
  activeTabService = inject(ActiveTabService);
  url = inject(Router).url;

  tab = computed(() => this.activeTabService.activeTabs()[this.activeTabKey] ?? this.tabNames.hearings);

  caseId = input(0, { transform: numberAttribute });

  caseFile$!: Observable<AdminCase>;
  hearings$!: Observable<Hearing[]>;
  transcripts$!: Observable<TranscriptsRow[]>;
  audio$!: Observable<PaginatedCaseAudio>;

  events = signal<CaseEvent[] | null>(null);

  eventsPageLimit = this.appConfig.getAppConfig()?.pagination.courtLogEventsPageLimit ?? 500;
  eventsSort = signal<{
    sortBy: AdminCaseEventSortBy;
    sortOrder: 'asc' | 'desc';
  } | null>(null);

  eventsCurrentPage = signal(1);
  eventsTotalItems = signal(0);
  eventsSort$ = toObservable(this.eventsSort);
  eventsCurrentPage$ = toObservable(this.eventsCurrentPage);

  audio = signal<CaseAudio[] | null>(null);

  audioPageLimit = this.appConfig.getAppConfig()?.pagination.caseAudiosPageLimit ?? 500;
  audioSort = signal<{
    sortBy: CaseAudioSortBy;
    sortOrder: 'asc' | 'desc';
  } | null>(null);

  audioCurrentPage = signal(1);
  audioTotalItems = signal(0);
  audioSort$ = toObservable(this.audioSort);
  audioCurrentPage$ = toObservable(this.audioCurrentPage);

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/search';

  data$!: Observable<{
    caseFile: AdminCase | null;
    hearings: Hearing[];
    transcripts: TranscriptsRow[];
  }>;

  ngOnInit(): void {
    this.caseFile$ = this.caseAdminService.getCase(this.caseId()).pipe(
      switchMap((caseFile) => {
        const userIds = [
          caseFile.createdById,
          caseFile.lastModifiedById,
          caseFile.caseDeletedById,
          caseFile.dataAnonymisedById,
        ].filter(Boolean) as number[];

        return userIds.length
          ? this.userAdminService.getUsersById(userIds).pipe(
              map((users) => {
                const userMap = new Map(users.map((user) => [user.id, user.fullName]));
                return {
                  ...caseFile,
                  createdBy: userMap.get(caseFile.createdById) ?? 'System',
                  lastModifiedBy: userMap.get(caseFile.lastModifiedById) ?? 'System',
                  caseDeletedBy: userMap.get(caseFile.caseDeletedById) ?? 'System',
                  dataAnonymisedBy: userMap.get(caseFile.dataAnonymisedById) ?? 'System',
                };
              })
            )
          : of({
              ...caseFile,
              createdBy: 'System',
              lastModifiedBy: 'System',
              caseDeletedBy: 'System',
              dataAnonymisedBy: 'System',
            });
      })
    );

    this.hearings$ = this.caseService.getCaseHearings(this.caseId()).pipe(catchError(() => of([])));
    this.transcripts$ = this.caseService.getCaseTranscripts(this.caseId()).pipe(
      map((transcript) => this.mappingService.mapTranscriptRequestToRows(transcript)),
      catchError(() => of([]))
    );

    this.data$ = combineLatest({
      caseFile: this.caseFile$.pipe(catchError(() => of(null))),
      hearings: this.hearings$,
      transcripts: this.transcripts$,
    });

    this.loadEvents();
    this.loadAudio();
  }

  private loadAudio(): void {
    this.caseAudioLoader.load(this.caseId(), {
      page: this.audioCurrentPage(),
      pageSize: this.audioPageLimit,
      sort: this.audioSort(),
      setEvents: this.audio.set,
      setTotalItems: this.audioTotalItems.set,
      setCurrentPage: this.audioCurrentPage.set,
    });
  }

  private loadEvents(): void {
    this.caseEventsLoader.load(this.caseId(), {
      page: this.eventsCurrentPage(),
      pageSize: this.eventsPageLimit,
      sort: this.eventsSort(),
      setEvents: this.events.set,
      setTotalItems: this.eventsTotalItems.set,
      setCurrentPage: this.eventsCurrentPage.set,
    });
  }

  onPageChange(type: 'audio' | 'events', page: number) {
    if (type === 'audio') {
      this.audioCurrentPage.set(page);
      this.loadAudio();
    }

    if (type === 'events') {
      this.eventsCurrentPage.set(page);
      this.loadEvents();
    }
  }

  onSortChange(type: 'audio' | 'events', sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
    if (type === 'audio' && this.isAudioSortBy(sort.sortBy)) {
      this.audioSort.set({
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
      });
      this.loadAudio();
    }

    if (type === 'events' && this.isAdminEventSortBy(sort.sortBy)) {
      this.eventsSort.set({
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
      });
      this.loadEvents();
    }
  }

  onTabChange(tab: string) {
    this.activeTabService.setActiveTab(this.activeTabKey, tab);
  }

  private isAdminEventSortBy(value: string): value is AdminCaseEventSortBy {
    return ['eventId', 'courtroom', 'text', 'hearingDate', 'timestamp', 'eventName'].includes(value);
  }

  private isAudioSortBy(value: string): value is CaseAudioSortBy {
    return ['audioId', 'courtroom', 'startTime', 'endTime', 'channel'].includes(value);
  }
}
