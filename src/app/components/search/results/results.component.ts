import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseData } from '../../../../app/types/case';
import { DateTimeService } from '../../../services/datetime/datetime.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
export interface SortingInterface {
  column: string;
  order: 'asc' | 'desc';
}
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
    column: 'id',
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

  sortTable(column: 'case_id' | 'courthouse'): void {
    this.cases.sort((a, b) => {
      const valueA: string | number | undefined = a[column];
      const valueB: string | number | undefined = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Both values are strings, use localeCompare
        return this.compareStrings(column, valueA, valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        // Both values are numbers, compare numerically
        return this.compareNumbers(column, valueA, valueB);
      } else {
        return 0;
      }
    });

    this.sorting = {
      column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
    };

    this.updatePagedCases();
  }

  compareStrings(column: string, a: string, b: string): number {
    return this.isAscSorting(column) ? a.localeCompare(b) : b.localeCompare(a);
  }

  compareNumbers(column: string, a: number, b: number): number {
    return this.isAscSorting(column) ? a - b : b - a;
  }

  isDescSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  isAscSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
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
    return DateTimeService.getdddDMMMYYYY(d);
  }

  private updatePagedCases(): void {
    this.pagedCases = this.paginate(this.cases, this.pageLimit, this.currentPage);
  }

  private paginate(array: CaseData[], pageSize: number, currentPage: number) {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }
}
