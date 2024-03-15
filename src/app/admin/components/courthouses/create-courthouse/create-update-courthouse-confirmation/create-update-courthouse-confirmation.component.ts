import { Region } from '@admin-types/courthouses/region.interface';
import { CreateUpdateCourthouseFormValues, SecurityGroup } from '@admin-types/index';
import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';

type courthouseDetailsVM = {
  'Courthouse name': string | null | undefined;
  'Display name': string | null | undefined;
  Region: string | null | undefined;
  'Transcription companies': string | null | undefined;
};

@Component({
  selector: 'app-create-update-courthouse-confirmation',
  standalone: true,
  imports: [DetailsTableComponent],
  templateUrl: './create-update-courthouse-confirmation.component.html',
  styleUrl: './create-update-courthouse-confirmation.component.scss',
})
export class CreateUpdateCourthouseConfirmationComponent implements OnChanges {
  @Input() values: CreateUpdateCourthouseFormValues = {
    courthouseName: null,
    displayName: null,
    regionId: null,
    securityGroupIds: [],
  };
  @Input() regions!: Region[];
  @Input() companies!: SecurityGroup[];
  @Input() update: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  router = inject(Router);
  courthouseDetails!: courthouseDetailsVM;
  currentUrl = this.router.url.split('#')[0];

  ngOnChanges() {
    this.courthouseDetails = this.mapFormValuesToDetailsTable(this.values);
  }

  onReturnCourthouseName(event: Event) {
    this.goBack(event);
    this.router.navigate([this.currentUrl], { fragment: 'courthouseName' });
  }
  onReturnDisplayName(event: Event) {
    this.goBack(event);
    this.router.navigate([this.currentUrl], { fragment: 'displayName' });
  }
  onReturnRegion(event: Event) {
    this.goBack(event);
    this.router.navigate([this.currentUrl], { fragment: 'regionId' });
  }
  onReturnCompanies(event: Event) {
    this.goBack(event);
    this.router.navigate([this.currentUrl], { fragment: 'transcriptionCompanies' });
  }

  goBack(event: Event) {
    event.preventDefault();
    this.back.emit();
  }

  private mapFormValuesToDetailsTable(values: CreateUpdateCourthouseFormValues): courthouseDetailsVM {
    const regionId = values?.regionId?.toString();
    let region;
    if (regionId) {
      region = this.regions?.find((region) => region.id === parseInt(regionId));
    }
    const companyNumberIds = values?.securityGroupIds.map((companyId) => parseInt(companyId));
    const selectedCompanies = this.companies.filter((company) => companyNumberIds.includes(company.id));

    return {
      'Courthouse name': values.courthouseName,
      'Display name': values.displayName,
      Region: region?.name || 'No region',
      'Transcription companies': selectedCompanies.length
        ? selectedCompanies.map((selectedCompany) => selectedCompany.name).join('\r\n')
        : 'None',
    };
  }
}
