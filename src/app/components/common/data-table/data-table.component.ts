import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '@common/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterLink],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnChanges {
  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() caption = '';
  @Input() rowSelectable = false;
  @Input() pagination = true;
  @Input() pageLimit = 25;
  @Output() rowSelect = new EventEmitter<any[]>();

  selectedRows: any[] = [];
  pagedRows: any[] = [];
  currentPage = 1;

  sorting: SortingInterface = {
    column: '',
    order: 'asc',
  };

  ngOnChanges(): void {
    this.sorting.column = '';
    this.currentPage = 1;
    this.updatePagedData();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePagedData();
  }

  sortTable(column: any): void {
    this.sorting = {
      column: column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
    };

    this.rows.sort((a, b) => {
      const valueA: string | undefined = a[column];
      const valueB: string | undefined = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.compareStrings(column, valueA, valueB);
      } else {
        return 0;
      }
    });

    this.updatePagedData();
  }

  isRowSelected(row: any) {
    return this.selectedRows.includes(row);
  }

  toggleRowSelection(row: any) {
    const index = this.selectedRows.indexOf(row);
    if (index === -1) {
      // Row not selected, add it to the selection
      this.selectedRows.push(row);
    } else {
      // Row already selected, remove it from the selection
      this.selectedRows.splice(index, 1);
    }
    this.rowSelect.emit(this.selectedRows);
  }

  onSelectAllChanged(checked: boolean) {
    if (checked) {
      this.selectedRows = [...this.rows];
    } else {
      this.selectedRows = [];
    }
    this.rowSelect.emit(this.selectedRows);
  }

  compareStrings(column: any, a: string, b: string): number {
    return this.isAscSorting(column) ? a.localeCompare(b) : b.localeCompare(a);
  }

  isDescSorting(column: any): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  isAscSorting(column: any): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }

  getAriaSort(column: any): 'ascending' | 'descending' | 'none' {
    if (this.sorting.column === column) {
      return this.isAscSorting(column) ? 'ascending' : 'descending';
    }
    return 'none';
  }

  private updatePagedData(): void {
    this.pagedRows = this.paginate(this.rows, this.pageLimit, this.currentPage);
  }

  private paginate(array: any[], pageSize: number, currentPage: number) {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }
}

export interface SortingInterface {
  column: string;
  order: 'asc' | 'desc';
}
