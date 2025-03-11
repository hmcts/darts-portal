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
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { CaseAdditionalDetailsComponent } from './case-file/case-additional-details/case-additional-details.component';
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
  ],
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
})
export class CaseComponent implements OnInit {
  caseService = inject(CaseService);
  userAdminService = inject(UserAdminService);
  caseAdminService = inject(AdminCaseService);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  caseId = input(0, { transform: numberAttribute });

  caseFile$!: Observable<AdminCase>;
  hearings$!: Observable<Hearing[]>;

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/search';

  data$!: Observable<{ caseFile: AdminCase | null; hearings: Hearing[] }>;

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

    this.data$ = combineLatest({
      caseFile: this.caseFile$.pipe(catchError(() => of(null))),
      hearings: this.hearings$,
    });
  }
}
