import { AsyncPipe } from '@angular/common';
import { Component, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { CaseFileComponent } from './case-file/case-file.component';

@Component({
  selector: 'app-case',
  imports: [CaseFileComponent, RouterLink, LoadingComponent, AsyncPipe, TabsComponent, TabDirective],
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
})
export class CaseComponent {
  caseService = inject(AdminCaseService);

  caseId = input(0, { transform: numberAttribute });

  caseFile$ = this.caseService.getCase(this.caseId());
}
