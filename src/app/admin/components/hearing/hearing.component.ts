import { HearingAudio } from '@admin-types/hearing/hearing-audio.type';
import { AdminHearingEvent } from '@admin-types/hearing/hearing-events.type';
import { AdminHearing } from '@admin-types/hearing/hearing.type';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input, numberAttribute, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { Transcript } from '@portal-types/transcriptions';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { AdminHearingService } from '@services/admin-hearing/admin-hearing.service';
import { CaseService } from '@services/case/case.service';
import { HistoryService } from '@services/history/history.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { HearingAudiosComponent } from './hearing-file/hearing-audios/hearing-audios.component';
import { HearingEventsComponent } from './hearing-file/hearing-events/hearing-events.component';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { HearingTranscriptsComponent } from './hearing-file/hearing-transcripts/hearing-transcripts.component';

@Component({
  selector: 'app-hearing',
  imports: [
    RouterLink,
    HearingFileComponent,
    AsyncPipe,
    TabsComponent,
    TabDirective,
    HearingAudiosComponent,
    HearingEventsComponent,
    HearingTranscriptsComponent,
  ],
  templateUrl: './hearing.component.html',
  styleUrl: './hearing.component.scss',
})
export class HearingComponent implements OnInit {
  private readonly activeTabKey = 'admin-hearing-details';

  readonly tabNames = {
    audio: 'Audio',
    events: 'Events',
    transcripts: 'Transcripts',
  } as const;

  adminHearingService = inject(AdminHearingService);
  historyService = inject(HistoryService);
  userAdminService = inject(UserAdminService);
  activeTabService = inject(ActiveTabService);
  caseService = inject(CaseService);

  url = inject(Router).url;

  cleanedUrl = this.getCleanedUrl();

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/search';

  hearingId = input(0, { transform: numberAttribute });

  hearing$!: Observable<AdminHearing>;
  audios$!: Observable<HearingAudio[]>;
  events$!: Observable<AdminHearingEvent[]>;
  transcripts$!: Observable<Transcript[]>;

  data$!: Observable<{
    hearing: AdminHearing | null;
    audios: HearingAudio[];
    events: AdminHearingEvent[];
    transcripts: Transcript[];
  }>;

  tab = computed(() => this.activeTabService.activeTabs()[this.activeTabKey] ?? this.tabNames.audio);

  ngOnInit(): void {
    this.hearing$ = this.adminHearingService.getHearing(this.hearingId()).pipe(
      switchMap((hearing) => {
        const userIds = [hearing.createdById, hearing.lastModifiedById].filter(Boolean) as number[];

        return userIds.length > 0
          ? this.userAdminService.getUsersById(userIds).pipe(
              map((users) => {
                const userMap = new Map(users.map((user) => [user.id, user.fullName]));

                return {
                  ...hearing,
                  createdBy: userMap.get(hearing.createdById) ?? 'System',
                  lastModifiedBy: userMap.get(hearing.lastModifiedById) ?? 'System',
                };
              })
            )
          : of({ ...hearing, createdBy: 'System', lastModifiedBy: 'System' });
      })
    );

    this.audios$ = this.adminHearingService.getHearingAudios(this.hearingId()).pipe(catchError(() => of([])));
    this.events$ = this.adminHearingService.getEvents(this.hearingId()).pipe(catchError(() => of([])));
    this.transcripts$ = this.caseService.getHearingTranscripts(this.hearingId()).pipe(catchError(() => of([])));

    this.data$ = combineLatest({
      hearing: this.hearing$.pipe(catchError(() => of(null))),
      audios: this.audios$,
      events: this.events$,
      transcripts: this.transcripts$,
    });
  }

  onTabChange(tab: string) {
    this.activeTabService.setActiveTab(this.activeTabKey, tab);
  }

  private getCleanedUrl(): string {
    console.log(this.url.split('?')[0]);
    return this.url.split('?')[0]; // Get URL without query params
  }
}
