import { Component } from '@angular/core';
import { DetailsTableLink } from '@core-types/details-table/details-table-array.interface';

export interface SummaryListItem {
  key: string;
  value: string | DetailsTableLink[];
  action?: SummaryListAction;
}

@Component({
  selector: 'app-summary-list',
  standalone: true,
  imports: [],
  templateUrl: './summary-list.component.html',
  styleUrl: './summary-list.component.scss',
})
export class SummaryListComponent {}
