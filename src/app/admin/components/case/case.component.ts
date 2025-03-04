import { AsyncPipe } from '@angular/common';
import { Component, inject, input, numberAttribute } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { CaseHearingsTableComponent } from '@components/case/case-file/case-hearings-table/case-hearings-table.component';
import { TabDirective } from '@directives/tab.directive';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { CaseService } from '@services/case/case.service';
import { HistoryService } from '@services/history/history.service';
import { catchError, combineLatest, of } from 'rxjs';
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
    CaseHearingsTableComponent,
    GovukHeadingComponent,
  ],
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
})
export class CaseComponent {
  caseAdminService = inject(AdminCaseService);
  caseService = inject(CaseService);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  caseId = input(0, { transform: numberAttribute });

  caseFile$ = this.caseAdminService.getCase(this.caseId());
  hearings$ = this.caseService.getCaseHearings(this.caseId());

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/search';

  data$ = combineLatest({
    caseFile: this.caseFile$,
    hearings: this.hearings$.pipe(catchError(() => of(null))),
  });
}
