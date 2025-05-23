import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { PaginationComponent } from '@components/common/pagination/pagination.component';
import { dateTimeKeys } from '@constants/datetime-keys';
import { CustomSort, DatatableColumn } from '@core-types/index';
import { TableBodyTemplateDirective } from '@directives/table-body-template.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<TRow> implements OnChanges, OnInit {
  @Input() rows: TRow[] = [];
  @Input() columns: DatatableColumn[] = [];
  @Input() captionType: 'default' | 'heading' | 'results' = 'default';
  @Input() caption = '';
  @Input() rowSelectable = false;
  @Input() pagination = true;
  @Input() maxHeight = '';
  @Input() pageLimit = 25;
  @Input() noDataMessage = 'No data to display.';
  @Input() checkboxKey = '';
  @Input() sortAndPaginateOnRowsChanged = true; // To maintain the sorting and pagination when rows are changed e.g. polling updates the data
  @Input() hiddenCaption = false;
  @Input() isHorizontalScroll = false;
  @Input() singleRowSelect = false;

  @Input() backendPagination = false;
  @Input() totalItems?: number;
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ sortBy: string; sortOrder: 'asc' | 'desc' }>();

  @Output() rowSelect = new EventEmitter<TRow[]>();

  // Two way binding for selected rows
  @Input() selectedRows: TRow[] = [];
  @Output() selectedRowsChange = new EventEmitter<TRow[]>();

  @ContentChild(TableBodyTemplateDirective, { read: TemplateRef })
  bodyTemplate?: TemplateRef<unknown>;

  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rowTemplate?: TemplateRef<TRow>;

  pagedRows: TRow[] = [];
  initialRows: TRow[] = [];
  currentPage = 1;

  sorting: SortingInterface<TRow> = {
    column: '',
    order: 'asc',
    sortFn: undefined,
  };

  ngOnInit(): void {
    const columnToSort = this.columns.find((column) => column.sortOnLoad !== undefined);

    if (columnToSort) {
      this.sortTable(columnToSort.prop, undefined, columnToSort.sortOnLoad);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.rows) {
      return;
    }

    this.initialRows = [...this.rows];

    if (this.backendPagination) {
      this.pagedRows = this.rows;
      return;
    }

    if (!this.sortAndPaginateOnRowsChanged) {
      this.sorting.column = '';
      this.currentPage = 1;
      this.updatePagedData();
    } else {
      this.sorting.order = this.isDescSorting(this.sorting.column) ? 'asc' : 'desc';
      this.sortTable(this.sorting.column, this.sorting.sortFn);
    }
  }

  onPageChanged(page: number): void {
    this.currentPage = page;

    if (this.backendPagination) {
      this.pageChange.emit(page);
    } else {
      this.updatePagedData();
    }
  }

  resetRows() {
    this.rows = [...this.initialRows];
  }

  private sortOrder(column: string): 'asc' | 'desc' {
    if (this.isDateColumn(column)) {
      return this.sorting?.column === column && this.sorting?.order === 'desc' ? 'asc' : 'desc';
    }

    return this.sorting?.column === column && this.sorting?.order === 'asc' ? 'desc' : 'asc';
  }

  sortTable(column: string, sortFn?: CustomSort<TRow>, order?: 'asc' | 'desc'): void {
    this.sorting = {
      column: column,
      order: order || this.sortOrder(column),
      sortFn: sortFn,
    };

    if (this.backendPagination) {
      this.sortChange.emit({
        sortBy: column,
        sortOrder: this.sorting.order,
      });
      return;
    }

    this.resetRows();

    if (sortFn) {
      this.rows = this.rows.toSorted((a: TRow, b: TRow) => sortFn(a, b, this.sorting.order));
      this.updatePagedData();
      return;
    }

    this.rows = this.rows.toSorted((a: TRow, b: TRow) => {
      const valueA = (a as { [key: string]: unknown })[column];
      const valueB = (b as { [key: string]: unknown })[column];

      // Move falsy values, excluding 0, (undefined, null, '') to start or end
      const falsyComparison = this.compareFalsyValues(valueA, valueB, this.isAscSorting(column));
      if (falsyComparison !== 0) {
        return falsyComparison;
      }

      const isStrings = typeof valueA === 'string' && typeof valueB === 'string';
      const isNumbers = typeof valueA === 'number' && typeof valueB === 'number';

      if (this.isLuxonDateTime(valueA) && this.isLuxonDateTime(valueB)) {
        // if both values are luxon DateTime, compare them as DateTime
        return this.compareDates(column, valueA as DateTime, valueB as DateTime);
      } else if (isStrings && this.isDateTime(valueA) && this.isDateTime(valueB)) {
        // if both values are strings and luxon DateTime, compare them as DateTime
        return this.compareDates(column, DateTime.fromISO(valueA), DateTime.fromISO(valueB));
      } else if (column === 'courtroom' && isStrings && this.isNumeric(valueA) && this.isNumeric(valueB)) {
        return this.compareNumbers(column, +valueA, +valueB);
      } else if (isStrings) {
        //String sorting
        return this.compareStrings(column, valueA, valueB);
      } else if (isNumbers) {
        //Number sorting
        return this.compareNumbers(column, valueA, valueB);
      } else if (this.isBoolean(valueA, valueB)) {
        //Boolean sorting
        return this.compareStrings(column, (valueA as boolean).toString(), (valueB as boolean).toString());
      } else if (Array.isArray(valueA) && Array.isArray(valueB)) {
        //Array sorting
        return this.compareStrings(column, valueA[0], valueB[0]);
      } else {
        return 0;
      }
    });
    this.updatePagedData();
  }

  private isDateColumn(column: string): boolean {
    if (dateTimeKeys.includes(column)) {
      return true;
    }

    // Fallback to dynamic inference (inspect first 3 rows)
    const rowsToCheck = this.rows.slice(0, 3);
    return rowsToCheck.some((row) => {
      if (!row) return false;
      const value = (row as { [key: string]: unknown })[column];
      return this.isLuxonDateTime(value);
    });
  }

  private isBoolean(valueA: unknown, valueB: unknown): boolean {
    return typeof valueA === 'boolean' && typeof valueB === 'boolean';
  }

  isRowSelected(row: TRow) {
    return this.selectedRows.includes(row);
  }

  toggleRowSelection(row: TRow) {
    if (this.singleRowSelect) {
      // In single select mode, replace the selection entirely
      this.selectedRows = [row];
    } else {
      const index = this.selectedRows.indexOf(row);
      if (index === -1) {
        this.selectedRows.push(row);
      } else {
        this.selectedRows.splice(index, 1);
      }
    }
    this.rowSelect.emit(this.selectedRows);
    this.selectedRowsChange.emit(this.selectedRows);
  }

  onSelectAllChanged(checked: boolean) {
    if (checked) {
      this.selectedRows = [...this.rows];
    } else {
      this.selectedRows = [];
    }
    this.rowSelect.emit(this.selectedRows);
    this.selectedRowsChange.emit(this.selectedRows);
  }

  isAllSelected() {
    const numSelected = this.selectedRows.length;
    const numRows = this.pagedRows.length;
    return numSelected == numRows;
  }

  isDateTime(value: string): boolean {
    return DateTime.fromISO(value).isValid;
  }

  compareStrings(column: string, a: string, b: string): number {
    return this.isAscSorting(column) ? a.localeCompare(b) : b.localeCompare(a);
  }

  compareNumbers(column: string, a: number, b: number): number {
    return this.isAscSorting(column) ? a - b : b - a;
  }

  compareDates(column: string, a: DateTime, b: DateTime): number {
    return this.isAscSorting(column) ? a.toUnixInteger() - b.toUnixInteger() : b.toUnixInteger() - a.toUnixInteger();
  }

  compareFalsyValues = (valueA: unknown, valueB: unknown, isAscending: boolean): number => {
    const isFalsyA = valueA === undefined || valueA === null || valueA === '';
    const isFalsyB = valueB === undefined || valueB === null || valueB === '';

    if (isFalsyA && !isFalsyB) {
      return isAscending ? -1 : 1;
    } else if (!isFalsyA && isFalsyB) {
      return isAscending ? 1 : -1;
    } else {
      return 0;
    }
  };

  isNumeric(num: string) {
    return !isNaN(parseFloat(String(num)));
  }

  isDescSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  isAscSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }

  isLuxonDateTime(value: unknown): boolean {
    return DateTime.isDateTime(value);
  }

  getAriaSort(column: string): 'ascending' | 'descending' | 'none' {
    if (this.sorting.column === column) {
      return this.isAscSorting(column) ? 'ascending' : 'descending';
    }
    return 'none';
  }

  private updatePagedData(): void {
    this.pagedRows = this.pagination ? this.paginate(this.rows, this.pageLimit, this.currentPage) : this.rows;
  }

  private paginate(array: TRow[], pageSize: number, currentPage: number) {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }

  getCurrentPageCaptionCount() {
    const earliestCaption = (this.currentPage - 1) * this.pageLimit + 1;
    let latestCaption = this.currentPage * this.pageLimit;
    if (latestCaption > this.rows.length) {
      latestCaption = this.rows.length;
    }

    return `${earliestCaption}-${latestCaption}`;
  }
}

export interface SortingInterface<Row> {
  column: string;
  order: 'asc' | 'desc';
  sortFn?: CustomSort<Row>;
}
