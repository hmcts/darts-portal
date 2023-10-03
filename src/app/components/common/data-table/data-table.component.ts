import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '@common/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { TableRowTemplateDirective } from 'src/app/directives/table-row-template.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterLink, TableRowTemplateDirective],
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

  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rowTemplate?: TemplateRef<any>;

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
      const valueA: string | number | undefined = a[column];
      const valueB: string | number | undefined = b[column];

      if (column === 'date' && typeof valueA === 'string' && typeof valueB === 'string') {
        //Date sorting
        return this.compareDates(column, new Date(valueA), new Date(valueB));
      }
      if (
        column === 'courtroom' &&
        typeof valueA === 'string' &&
        typeof valueB === 'string' &&
        this.isNumeric(valueA) &&
        this.isNumeric(valueB)
      ) {
        //Courtroom convert to number if numeric parseable
        return this.compareNumbers(column, +valueA, +valueB);
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        //String sorting
        return this.compareStrings(column, valueA, valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        //Number sorting
        return this.compareNumbers(column, valueA, valueB);
      } else if (Array.isArray(valueA) && Array.isArray(valueB)) {
        //Array sorting
        return this.compareStrings(column, valueA[0], valueB[0]);
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

  compareNumbers(column: any, a: number, b: number): number {
    return this.isAscSorting(column) ? a - b : b - a;
  }

  compareDates(column: any, a: Date, b: Date): number {
    return this.isAscSorting(column) ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
  }

  isNumeric(num: string) {
    return !isNaN(parseFloat(String(num)));
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
