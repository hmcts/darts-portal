import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { CaseRetentionChange } from 'src/app/portal/models/case/case-retention-change.interface';
import { CaseRetentionPageState } from 'src/app/portal/models/case/case-retention-page-state.type';
import { CaseService } from 'src/app/portal/services/case/case.service';

@Component({
  selector: 'app-case-retention-confirm',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReportingRestrictionComponent,
    ValidationErrorSummaryComponent,
    DetailsTableComponent,
  ],
  templateUrl: './case-retention-confirm.component.html',
  styleUrls: ['./case-retention-confirm.component.scss'],
})
export class CaseRententionConfirmComponent {
  @Input() state!: CaseRetentionPageState;

  @Input() caseId!: number;
  @Input() caseNumber!: string | undefined;
  @Input() caseCourthouse!: string | undefined;
  @Input() caseDefendants!: string[] | undefined;
  @Input() newRetentionDate!: Date | null;
  @Input() newRetentionReason!: string;
  @Input() newRetentionPermanent!: boolean;

  @Output() stateChange = new EventEmitter<CaseRetentionPageState>();

  router = inject(Router);
  datePipe = inject(DatePipe);
  caseService = inject(CaseService);
  currentUrl = this.router.url.split('#')[0];

  public get caseDetails() {
    const details = {
      'Case ID': this.caseNumber,
      Courthouse: this.caseCourthouse,
      'Defendant(s)': this.caseDefendants,
    };
    return details;
  }

  onConfirm() {
    const caseRetentionChange: CaseRetentionChange = {
      case_id: this.caseId,
      retention_date: !this.newRetentionPermanent
        ? this.datePipe.transform(this.newRetentionDate, 'yyyy-MM-dd') || ''
        : undefined,
      is_permanent_retention: this.newRetentionPermanent || undefined,
      comments: this.newRetentionReason || '',
    };
    this.caseService.postCaseRetentionChange(caseRetentionChange).subscribe(() => {
      this.stateChange.emit('Success');
    });
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }

  goBacktoChangeScreen(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Change');
  }

  onReturnDate(event: Event) {
    this.goBacktoChangeScreen(event);
    this.router.navigate([this.currentUrl], { fragment: 'retention-date' });
  }

  onReturnReason(event: Event) {
    this.goBacktoChangeScreen(event);
    this.router.navigate([this.currentUrl], { fragment: 'change-reason' });
  }
}
