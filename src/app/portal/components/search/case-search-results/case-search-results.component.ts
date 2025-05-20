import { Component, inject, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableBodyTemplateDirective } from '@directives/table-body-template.directive';
import { ArrayDisplayPipe } from '@pipes/array-display.pipe';
import { CaseSearchResult } from '@portal-types/index';
import { ActiveTabService } from '@services/active-tab/active-tab.service';

@Component({
  selector: 'app-case-search-results',
  templateUrl: './case-search-results.component.html',
  styleUrls: ['./case-search-results.component.scss'],
  imports: [RouterLink, DataTableComponent, TableBodyTemplateDirective, ArrayDisplayPipe],
  standalone: true,
})
export class CaseSearchResultsComponent implements OnChanges {
  activeTabService = inject(ActiveTabService);

  @Input() cases: CaseSearchResult[] = [];
  @Input() caption = '';
  @Input() adminPortal = false;
  @Input() captionType: 'default' | 'heading' | 'results' = 'default';
  @Input() showRestrictions = true;

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'number', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: false },
    { name: 'Judge(s)', prop: 'judges', sortable: false },
    { name: 'Defendant(s)', prop: 'defendants', sortable: false },
  ];

  ngOnChanges(): void {
    if (this.adminPortal) {
      this.caption = `case result${this.cases.length > 1 ? 's' : ''}`;
    } else {
      this.caption = `${this.cases.length} result${this.cases.length > 1 ? 's' : ''}`;
    }
  }

  clearStoredTabs(): void {
    //Required to ensure other cases don't use other active tabs
    const screenId = this.adminPortal ? 'admin-case-details' : 'case';
    this.activeTabService.clearActiveTab(screenId);
  }
}
