import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { DateTimePipe } from '@pipes/dateTime.pipe';
import { JoinPipe } from '@pipes/join';
import { Case } from '@portal-types/case/case.type';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule, JoinPipe, ReportingRestrictionComponent, RouterLink, DateTimePipe, GovukHeadingComponent],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent {
  userService = inject(UserService);

  @Input() public caseFile!: Case;
}
