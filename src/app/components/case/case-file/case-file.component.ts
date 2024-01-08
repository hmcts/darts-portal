import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/index';
import { JoinPipe } from '@pipes/join';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule, JoinPipe, ReportingRestrictionComponent, RouterLink],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent {
  userService = inject(UserService);

  @Input() public caseFile!: Case;
}
