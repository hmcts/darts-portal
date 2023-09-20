import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@common/pagination/pagination.component';
import { CaseData, HearingData } from '@darts-types/index';
import { DateTimeService } from '@services/datetime/datetime.service';

export interface SortingInterface {
  column: string;
  order: 'asc' | 'desc';
}

export type SortableColumn = 'case_number' | 'courthouse';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [NgIf, NgFor, RouterLink, PaginationComponent],
  standalone: true,
})
export class ResultsComponent implements OnChanges {
  @Input() cases: CaseData[] = [];
  @Input() loaded = false;
  @Input() errorType = '';

  pagedCases: CaseData[] = [];
  currentPage = 1;
  pageLimit = 25;

  sorting: SortingInterface = {
    column: '',
    order: 'asc',
  };

  ngOnChanges(): void {
    this.currentPage = 1;
    this.updatePagedCases();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePagedCases();
  }

  sortTable(column: SortableColumn): void {
    this.sorting = {
      column: column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
    };

    this.cases.sort((a, b) => {
      const valueA: string | undefined = a[column];
      const valueB: string | undefined = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.compareStrings(column, valueA, valueB);
      } else {
        return 0;
      }
    });

    this.updatePagedCases();
  }

  compareStrings(column: SortableColumn, a: string, b: string): number {
    return this.isAscSorting(column) ? a.localeCompare(b) : b.localeCompare(a);
  }

  isDescSorting(column: SortableColumn): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  isAscSorting(column: SortableColumn): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }

  getAriaSort(column: SortableColumn): 'ascending' | 'descending' | 'none' {
    if (this.sorting.column === column) {
      return this.isAscSorting(column) ? 'ascending' : 'descending';
    }
    return 'none';
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
  getHearingsValue(c: CaseData, key: keyof HearingData): string {
    if (!c.hearings || c.hearings.length === 0) {
      return '';
    } else {
      if (c.hearings.length < 2) {
        if (key === 'date') {
          return this.getDateFormat(c.hearings[0][key]);
        } else {
          return c.hearings[0][key] as string;
        }
      } else {
        return 'Multiple';
      }
    }
  }

  isErrorHandledInTemplate() {
    return (
      this.errorType !== 'CASE_100' &&
      this.errorType !== 'CASE_101' &&
      this.errorType !== 'CASE_102' &&
      this.errorType !== 'ok'
    );
  }

  private getDateFormat(d: string): string {
    return DateTimeService.getdddDMMMYYYY(d);
  }

  private updatePagedCases(): void {
    this.pagedCases = this.paginate(this.cases, this.pageLimit, this.currentPage);
  }

  private paginate(array: CaseData[], pageSize: number, currentPage: number) {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }
}
