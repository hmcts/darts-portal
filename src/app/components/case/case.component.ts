import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { CaseService } from '@services/case/case.service';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [CommonModule, CaseFileComponent, HearingResultsComponent, BreadcrumbComponent, BreadcrumbDirective],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  public caseId = this.route.snapshot.params.caseId;
  public caseFile$;
  public hearings$;

  constructor() {
    this.caseFile$ = this.caseService.getCase(this.caseId);
    this.hearings$ = this.caseService.getCaseHearings(this.caseId);
  }
}
