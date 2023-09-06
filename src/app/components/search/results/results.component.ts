import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseData } from '../../../../app/types/case';
import { DateTimeService } from '../../../services/datetime/datetime.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [NgIf, NgFor, RouterLink, PaginationComponent],
  standalone: true,
})
export class ResultsComponent implements OnChanges {
  constructor(private dateTimeService: DateTimeService) {}

  @Input() cases: CaseData[] = [];
  @Input() loaded = false;
  @Input() errorType = '';

  pagedCases: CaseData[] = [];
  currentPage = 1;
  pageLimit = 25;

  ngOnChanges(): void {
    this.updatePagedCases();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePagedCases();
  }

  //Fetches correct display value for defendants and judges
  getNameValue(arr: string[] | undefined): string {
    if (arr) {
      if (arr.length === 0) {
        return '';
      } else {
        if (arr.length < 2) {
          return arr[0];
        } else {
          return 'Multiple';
        }
      }
    } else {
      return '';
    }
  }

  //Fetches correct display value for dates and courtrooms
  getHearingsValue(c: CaseData, key: string): string {
    if (!c.hearings || c.hearings.length === 0) {
      return '';
    } else {
      if (c.hearings.length < 2) {
        if (key === 'date') {
          return this.getDateFormat(c.hearings[0][key]);
        } else {
          return c.hearings[0][key];
        }
      } else {
        return 'Multiple';
      }
    }
  }

  private getDateFormat(d: string): string {
    return this.dateTimeService.getdddDMMMYYYY(d);
  }

  private updatePagedCases(): void {
    this.pagedCases = this.paginate(this.cases, this.pageLimit, this.currentPage);
  }

  private paginate(array: CaseData[], pageSize: number, currentPage: number) {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }
}
