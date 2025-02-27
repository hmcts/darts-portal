import { AsyncPipe } from '@angular/common';
import { Component, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map, switchMap } from 'rxjs';
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
  ],
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
})
export class CaseComponent {
  caseService = inject(AdminCaseService);
  userAdminService = inject(UserAdminService);

  caseId = input(0, { transform: numberAttribute });

  caseFile$ = this.caseService.getCase(this.caseId()).pipe(
    switchMap((caseFile) => {
      return this.userAdminService.getUsersById([caseFile.createdById, caseFile.lastModifiedById]).pipe(
        map((users) => {
          const userMap = new Map(users.map((user) => [user.id, user.fullName]));

          return {
            ...caseFile,
            createdBy: userMap.get(caseFile.createdById),
            lastModifiedBy: userMap.get(caseFile.lastModifiedById),
          };
        })
      );
    })
  );
}
