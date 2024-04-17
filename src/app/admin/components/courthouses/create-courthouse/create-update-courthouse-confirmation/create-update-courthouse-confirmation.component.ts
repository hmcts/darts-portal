import { Region } from '@admin-types/courthouses/region.interface';
import { CreateUpdateCourthouseFormValues, SecurityGroup } from '@admin-types/index';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';

@Component({
  selector: 'app-create-update-courthouse-confirmation',
  standalone: true,
  imports: [DetailsTableComponent],
  templateUrl: './create-update-courthouse-confirmation.component.html',
  styleUrl: './create-update-courthouse-confirmation.component.scss',
})
export class CreateUpdateCourthouseConfirmationComponent {
  @Input() values: CreateUpdateCourthouseFormValues = {
    courthouseName: null,
    displayName: null,
    regionId: undefined,
    securityGroupIds: [],
  };
  @Input() regions!: Region[];
  @Input() companies!: SecurityGroup[];
  @Input() update: boolean = false;
  @Input() hasData: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  router = inject(Router);
  currentUrl = this.router.url.split('#')[0];

  get courthouseDetails() {
    return this.mapFormValuesToDetailsTable(this.values);
  }

  onReturnCourthouseName() {
    this.goBack();
    this.router.navigate([this.currentUrl], { fragment: 'courthouseName' });
  }
  onReturnDisplayName() {
    this.goBack();
    this.router.navigate([this.currentUrl], { fragment: 'displayName' });
  }
  onReturnRegion() {
    this.goBack();
    this.router.navigate([this.currentUrl], { fragment: 'regionId' });
  }
  onReturnCompanies() {
    this.goBack();
    this.router.navigate([this.currentUrl], { fragment: 'transcriptionCompanies' });
  }

  goBack() {
    this.back.emit();
  }

  private mapFormValuesToDetailsTable(values: CreateUpdateCourthouseFormValues) {
    const regionId = values?.regionId?.toString();
    let region;
    if (regionId) {
      region = this.regions?.find((region) => region.id === parseInt(regionId));
    }
    const companyNumberIds = values?.securityGroupIds.map((companyId) => parseInt(companyId));
    const selectedCompanies = this.companies.filter((company) => companyNumberIds.includes(company.id));
    const selectedCompaniesNames = selectedCompanies.length
      ? selectedCompanies.map((selectedCompany) => selectedCompany.name).join('\r\n')
      : 'None';
    const regionName = region?.name ?? 'No region';

    return {
      'Courthouse name': values.courthouseName,
      'Display name': !this.update
        ? values.displayName
        : { value: values.displayName, action: { text: 'Change', fn: this.onReturnDisplayName.bind(this) } },
      Region: !this.update
        ? regionName
        : { value: regionName, action: { text: 'Change', fn: this.onReturnRegion.bind(this) } },
      'Transcription companies': !this.update
        ? selectedCompaniesNames
        : { value: selectedCompaniesNames, action: { text: 'Change', fn: this.onReturnCompanies.bind(this) } },
    };
  }
}
