import { CreateUpdateUserFormValues } from '@admin-types/index';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DetailsTableComponent } from '@common/details-table/details-table.component';

type userDetailsVM = {
  'Full name': string | null | undefined;
  'Email address': string | null | undefined;
  Description: string | null | undefined;
};

@Component({
  selector: 'app-create-update-user-confirmation',
  standalone: true,
  imports: [DetailsTableComponent],
  templateUrl: './create-update-user-confirmation.component.html',
  styleUrl: './create-update-user-confirmation.component.scss',
})
export class CreateUpdateUserConfirmationComponent implements OnChanges {
  @Input() values: CreateUpdateUserFormValues = { fullName: null, email: null, description: null };
  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  userDetails!: userDetailsVM;

  ngOnChanges() {
    this.userDetails = this.mapFormValuesToDetailsTable(this.values);
  }

  private mapFormValuesToDetailsTable(values: CreateUpdateUserFormValues): userDetailsVM {
    return {
      'Full name': values.fullName,
      'Email address': values.email,
      Description: values.description,
    };
  }
}
