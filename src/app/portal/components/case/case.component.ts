import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '@common/delete/delete.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { CaseEvent } from '@portal-types/events';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { AnnotationService } from '@services/annotation/annotation.service';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CaseService } from '@services/case/case.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { MappingService } from '@services/mapping/mapping.service';
import { UserService } from '@services/user/user.service';
import { catchError, combineLatest, map, of, shareReplay, switchMap } from 'rxjs';
import { CaseAnnotationsTableComponent } from './case-file/case-annotations-table/case-annotations-table.component';
import { CaseEventsTableComponent } from './case-file/case-events-table/case-events-table.component';
import { CaseFileComponent } from './case-file/case-file.component';
import { CaseHearingsTableComponent } from './case-file/case-hearings-table/case-hearings-table.component';
import { CaseTranscriptsTableComponent } from './case-file/case-transcripts-table/case-transcripts-table.component';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [
    CommonModule,
    CaseFileComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    LoadingComponent,
    DeleteComponent,
    CaseEventsTableComponent,
    CaseHearingsTableComponent,
    CaseTranscriptsTableComponent,
    CaseAnnotationsTableComponent,
    TabsComponent,
    TabDirective,
  ],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  private mappingService = inject(MappingService);
  private userService = inject(UserService);
  private annotationService = inject(AnnotationService);
  private fileDownloadService = inject(FileDownloadService);
  private tabsService = inject(ActiveTabService);
  private appConfig = inject(AppConfigService);

  public caseId = this.route.snapshot.params.caseId;
  public caseFile$ = this.caseService.getCase(this.caseId).pipe(shareReplay(1));
  public hearings$ = this.caseService.getCaseHearings(this.caseId);
  public transcripts$ = this.caseService
    .getCaseTranscripts(this.caseId)
    .pipe(map((transcript) => this.mappingService.mapTranscriptRequestToRows(transcript)));

  public annotations$ = this.caseFile$.pipe(
    switchMap((c) => {
      if (!c.courthouseId) return of(null);
      if (this.userService.isCourthouseJudge(c.courthouseId) || this.userService.isAdmin()) {
        return this.caseService.getCaseAnnotations(this.caseId);
      } else {
        return of(null);
      }
    })
  );

  public events = signal<CaseEvent[] | null>(null);
  private eventsLoaded = signal(false);

  eventsPageLimit = this.appConfig.getAppConfig()?.pagination.courtLogEventsPageLimit || 500;
  eventsSort = signal<{ sortBy: 'hearingDate' | 'timestamp' | 'eventName'; sortOrder: 'asc' | 'desc' } | null>(null);
  eventsCurrentPage = signal(1);
  eventsTotalItems = signal(0);

  private readonly screenId = 'case';

  selectedAnnotationsforDeletion: number[] = [];
  tab = this.tabsService.activeTabs()[this.screenId] ?? 'Hearings';

  data$ = combineLatest({
    caseFile: this.caseFile$,
    hearings: this.hearings$.pipe(catchError(() => of(null))),
    transcripts: this.transcripts$.pipe(catchError(() => of(null))),
    annotations: this.annotations$.pipe(catchError(() => of(null))),
  });

  ngOnInit(): void {
    if (this.tab === 'Court log') {
      this.loadEvents();
    }
  }

  onDeleteAnnotation(annotationId: number) {
    this.selectedAnnotationsforDeletion = [annotationId];
  }

  onDeleteConfirmed() {
    this.selectedAnnotationsforDeletion.forEach((annotationId) => {
      this.annotationService.deleteAnnotation(annotationId).subscribe(() => {
        this.data$ = combineLatest({
          caseFile: this.caseFile$,
          hearings: this.hearings$,
          transcripts: this.transcripts$,
          annotations: this.annotations$,
        });
        this.selectedAnnotationsforDeletion = [];
        this.tab = 'All annotations';
      });
    });
  }

  onDeleteCancelled() {
    this.selectedAnnotationsforDeletion = [];
    this.tab = 'All annotations';
  }

  onDownloadAnnotation(e: { annotationId: number; annotationDocumentId: number; fileName: string }) {
    this.annotationService
      .downloadAnnotationDocument(e.annotationId, e.annotationDocumentId)
      .subscribe((blob: Blob) => {
        this.fileDownloadService.saveAs(blob, e.fileName);
      });
  }

  onTabChange($event: TabDirective) {
    this.tabsService.setActiveTab(this.screenId, $event.name);

    //Only load events$ when Court log tab is clicked DMP-4897
    if ($event.name === 'Court log' && !this.eventsLoaded()) {
      this.loadEvents();
    }
  }

  loadEvents() {
    this.eventsLoaded.set(true);

    this.caseService
      .getCaseEventsPaginated(this.caseId, {
        page_number: this.eventsCurrentPage(),
        page_size: this.eventsPageLimit,
        sort_by: this.eventsSort()?.sortBy,
        sort_order: this.eventsSort()?.sortOrder,
      })
      .subscribe((events) => {
        this.events.set(events.data);
        this.eventsTotalItems.set(events.totalItems);
        this.eventsCurrentPage.set(events.currentPage);
      });
  }

  onPageChange(page: number) {
    this.eventsCurrentPage.set(page);
    this.loadEvents();
  }

  onSortChange(sort: { sortBy: 'hearingDate' | 'timestamp' | 'eventName'; sortOrder: 'asc' | 'desc' }) {
    this.eventsSort.set(sort);
    this.loadEvents();
  }
}
