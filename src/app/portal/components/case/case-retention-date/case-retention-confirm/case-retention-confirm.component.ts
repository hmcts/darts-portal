import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy, Router } from '@angular/router';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@components/common/validation-error-summary/validation-error-summary.component';
import { CaseRetentionChange, CaseRetentionPageState } from '@portal-types/index';
import { CaseService } from '@services/case/case.service';

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

  private routeReuseStrategy = (inject(RouteReuseStrategy).shouldReuseRoute = function () {
    return true;
  });
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
