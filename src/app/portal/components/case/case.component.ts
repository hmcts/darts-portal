import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '@common/delete/delete.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { InternalErrorComponent } from '@components/error/internal-server/internal-error.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { AnnotationService } from '@services/annotation/annotation.service';
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
    NotFoundComponent,
    ForbiddenComponent,
    InternalErrorComponent,
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
export class CaseComponent {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  private mappingService = inject(MappingService);
  private userService = inject(UserService);
  private annotationService = inject(AnnotationService);
  private fileDownloadService = inject(FileDownloadService);
  private tabsService = inject(ActiveTabService);

  public caseId = this.route.snapshot.params.caseId;
  public caseFile$ = this.caseService.getCase(this.caseId).pipe(shareReplay(1));
  public hearings$ = this.caseService.getCaseHearings(this.caseId);
  public events$ = this.caseService.getCaseEvents(this.caseId);
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

  private readonly screenId = 'case';

  selectedAnnotationsforDeletion: number[] = [];
  tab = this.tabsService.activeTabs()[this.screenId] ?? 'Hearings';

  data$ = combineLatest({
    caseFile: this.caseFile$,
    hearings: this.hearings$,
    transcripts: this.transcripts$.pipe(catchError(() => of(null))),
    annotations: this.annotations$,
    events: this.events$,
  });

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
          events: this.events$,
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
  }
}
