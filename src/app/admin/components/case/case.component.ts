import { AsyncPipe } from '@angular/common';
import { Component, inject, input, numberAttribute } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '@common/loading/loading.component';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { HistoryService } from '@services/history/history.service';
import { CaseFileComponent } from './case-file/case-file.component';

@Component({
  selector: 'app-case',
  imports: [CaseFileComponent, RouterLink, LoadingComponent, AsyncPipe],
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
})
export class CaseComponent {
  caseService = inject(AdminCaseService);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  caseId = input(0, { transform: numberAttribute });

  caseFile$ = this.caseService.getCase(this.caseId());

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/search';
}
