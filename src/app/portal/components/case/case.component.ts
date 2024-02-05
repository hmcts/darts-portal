import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { InternalErrorComponent } from '@components/error/internal-server/internal-error.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { MappingService } from '@services/mapping/mapping.service';
import { combineLatest, map } from 'rxjs';
import { CaseService } from 'src/app/portal/services/case/case.service';
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

  public caseId = this.route.snapshot.params.caseId;
  public caseFile$ = this.caseService.getCase(this.caseId);
  public hearings$ = this.caseService.getCaseHearings(this.caseId);
  public transcripts$ = this.caseService
    .getCaseTranscripts(this.caseId)
    .pipe(map((transcript) => this.mappingService.mapTranscriptRequestToRows(transcript)));

  data$ = combineLatest({
    hearings: this.hearings$,
    transcripts: this.transcripts$,
  });
}
