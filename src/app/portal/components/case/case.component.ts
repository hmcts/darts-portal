import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '@common/delete/delete.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { InternalErrorComponent } from '@components/error/internal-server/internal-error.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { AnnotationService } from '@services/annotation/annotation.service';
import { CaseService } from '@services/case/case.service';
import { MappingService } from '@services/mapping/mapping.service';
import { UserService } from '@services/user/user.service';
import { combineLatest, map, of } from 'rxjs';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [
    CommonModule,
    CaseFileComponent,
    HearingResultsComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    LoadingComponent,
    NotFoundComponent,
    ForbiddenComponent,
    InternalErrorComponent,
    DeleteComponent,
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

  public caseId = this.route.snapshot.params.caseId;
  public caseFile$ = this.caseService.getCase(this.caseId);
  public hearings$ = this.caseService.getCaseHearings(this.caseId);
  public transcripts$ = this.caseService
    .getCaseTranscripts(this.caseId)
    .pipe(map((transcript) => this.mappingService.mapTranscriptRequestToRows(transcript)));
  public annotations$ =
    this.userService.isJudge() || this.userService.isAdmin()
      ? this.caseService.getCaseAnnotations(this.caseId)
      : of(null);

  selectedAnnotationsforDeletion: number[] = [];

  data$ = combineLatest({
    hearings: this.hearings$,
    transcripts: this.transcripts$,
    annotations: this.annotations$,
  });

  onDeleteClicked(annotationId: number) {
    this.selectedAnnotationsforDeletion = [annotationId];
  }

  onDeleteConfirmed() {
    this.selectedAnnotationsforDeletion.forEach((annotationId) => {
      this.annotationService.deleteAnnotation(annotationId).subscribe(() => {
        this.data$ = combineLatest({
          hearings: this.hearings$,
          transcripts: this.transcripts$,
          annotations: this.annotations$,
        });
        this.selectedAnnotationsforDeletion = [];
        // this.defaultTab = 'Annotations';
      });
    });
  }

  onDeleteCancelled() {
    this.selectedAnnotationsforDeletion = [];
    // this.defaultTab = 'Annotations';
  }
}
