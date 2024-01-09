import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { Case } from '@darts-types/index';
import { JoinPipe } from '@pipes/join';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule, JoinPipe, ReactiveFormsModule, ReportingRestrictionComponent, RouterLink],
  templateUrl: './case-retention.component.html',
  styleUrls: ['./case-retention.component.scss'],
})
export class CaseRententionComponent {
  private route = inject(ActivatedRoute);
  caseId = this.route.snapshot.params.caseId;
  userService = inject(UserService);
  changeReasonFormControl = new FormControl('');
  retainFormControl = new FormControl('');
  retainDate = new FormControl();

  buttonsError = '';
  rententionCharacterLimit = 200;

  @Input() public caseFile!: Case;
  @Output() errors = new EventEmitter<{ fieldId: string; message: string }[]>();

  get remainingCharacterCount() {
    return this.rententionCharacterLimit - (this.changeReasonFormControl.value?.length || 0);
  }

  onChange() {
    console.log(this.changeReasonFormControl.value);
    this.buttonsError = '';
    this.errors.emit([]);
  }

  onConfirm() {}

  onCancel(event: Event) {
    event.preventDefault();
  }
}
