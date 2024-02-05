import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { Case } from '@portal-types/case/case.type';
import { JoinPipe } from 'src/app/core/pipes/join';
import { LuxonDatePipe } from 'src/app/core/pipes/luxon-date.pipe';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule, JoinPipe, ReportingRestrictionComponent, RouterLink, LuxonDatePipe],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent {
  userService = inject(UserService);

  @Input() public caseFile!: Case;
}
