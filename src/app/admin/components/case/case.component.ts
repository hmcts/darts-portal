import { AdminCase } from '@admin-types/case/case.type';
import { AsyncPipe } from '@angular/common';
import { Component, inject, input, numberAttribute, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { CaseHearingsTableComponent } from '@components/case/case-file/case-hearings-table/case-hearings-table.component';
import { TabDirective } from '@directives/tab.directive';
import { Hearing } from '@portal-types/hearing';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { CaseService } from '@services/case/case.service';
import { HistoryService } from '@services/history/history.service';
import { catchError, combineLatest, Observable, of } from 'rxjs';
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
    GovukHeadingComponent,
    CaseHearingsTableComponent,
  ],
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
})
export class CaseComponent implements OnInit {
  caseAdminService = inject(AdminCaseService);
  caseService = inject(CaseService);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  caseId = input(0, { transform: numberAttribute });

  caseFile$!: Observable<AdminCase>;
  hearings$!: Observable<Hearing[]>;

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/search';

  data$!: Observable<{ caseFile: AdminCase | null; hearings: Hearing[] }>;

  ngOnInit(): void {
    this.caseFile$ = this.caseAdminService.getCase(this.caseId());
    this.hearings$ = this.caseService.getCaseHearings(this.caseId()).pipe(catchError(() => of([])));

    this.data$ = combineLatest({
      caseFile: this.caseFile$.pipe(catchError(() => of(null))),
      hearings: this.hearings$,
    });
  }
}
