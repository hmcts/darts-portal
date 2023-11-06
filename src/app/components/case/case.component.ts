import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { ForbiddenComponent } from '@common/forbidden/forbidden.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { NotFoundComponent } from '@common/not-found/not-found.component';
import { InternalErrorComponent } from '@components/error/internal-server/internal-error.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { MappingService } from '@services/mapping/mapping.service';
import { catchError, combineLatest, ignoreElements, map, of } from 'rxjs';
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
  ],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  private mappingService = inject(MappingService);
  private headerService = inject(HeaderService);
  public caseId = this.route.snapshot.params.caseId;
  public caseFile$ = this.caseService.getCase(this.caseId);
  public $caseLoadError = this.caseFile$.pipe(
    ignoreElements(),
    catchError((error: HttpErrorResponse) => {
      this.headerService.hideNavigation();
      return of(error.error);
    })
  );
  public hearings$ = this.caseService.getCaseHearings(this.caseId);
  public transcripts$ = this.caseService
    .getAllCaseTranscripts(this.caseId)
    .pipe(map((transcript) => this.mappingService.mapTranscriptRequestToRows(transcript)));

  data$ = combineLatest({
    hearings: this.hearings$,
    transcripts: this.transcripts$,
  });
}
