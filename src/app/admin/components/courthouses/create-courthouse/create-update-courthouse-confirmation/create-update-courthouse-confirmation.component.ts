import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DetailsTableComponent } from '@common/details-table/details-table.component';

type courthouseDetailsVM = {
  'Courthouse name': string | null | undefined;
  'Display name': string | null | undefined;
  Region: string | null | undefined;
};

@Component({
  selector: 'app-create-update-courthouse-confirmation',
  standalone: true,
  imports: [DetailsTableComponent],
  templateUrl: './create-update-courthouse-confirmation.component.html',
  styleUrl: './create-update-courthouse-confirmation.component.scss',
})
export class CreateUpdateCourthouseConfirmationComponent implements OnChanges {
  @Input() values: CreateUpdateCourthouseFormValues = { courthouseName: null, displayName: null, region: null };
  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  courthouseDetails!: courthouseDetailsVM;

  ngOnChanges() {
    this.courthouseDetails = this.mapFormValuesToDetailsTable(this.values);
  }

  private mapFormValuesToDetailsTable(values: CreateUpdateCourthouseFormValues): courthouseDetailsVM {
    return {
      'Courthouse name': values.courthouseName,
      'Display name': values.displayName,
      Region: values.region,
    };
  }
}
