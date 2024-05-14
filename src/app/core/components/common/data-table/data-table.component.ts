import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { PaginationComponent } from '@components/common/pagination/pagination.component';
import { CustomSort, DatatableColumn } from '@core-types/index';
import { TableBodyTemplateDirective } from '@directives/table-body-template.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, TableRowTemplateDirective, TableBodyTemplateDirective],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<TRow> implements OnChanges {
  @Input() rows: TRow[] = [];
  @Input() columns: DatatableColumn[] = [];
  @Input() captionType = 'default';
  @Input() caption = '';
  @Input() rowSelectable = false;
  @Input() pagination = true;
  @Input() maxHeight = '';
  @Input() pageLimit = 25;
  @Input() noDataMessage = 'No data to display.';
  @Input() checkboxKey = '';
  @Input() sortAndPaginateOnRowsChanged = true; // To maintain the sorting and pagination when rows are changed e.g. polling updates the data
  @Input() hiddenCaption = false;
  @Output() rowSelect = new EventEmitter<TRow[]>();

  // Two way binding for selected rows
  @Input() selectedRows: TRow[] = [];
  @Output() selectedRowsChange = new EventEmitter<TRow[]>();

  @ContentChild(TableBodyTemplateDirective, { read: TemplateRef })
  bodyTemplate?: TemplateRef<unknown>;

  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rowTemplate?: TemplateRef<TRow>;

  pagedRows: TRow[] = [];
  currentPage = 1;

  sorting: SortingInterface<TRow> = {
    column: '',
    order: 'asc',
    sortFn: undefined,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.rows) {
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
    this.updatePagedData();
  }

  sortTable(column: string, sortFn?: CustomSort<TRow>): void {
    this.sorting = {
      column: column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
      sortFn: sortFn,
    };

    if (sortFn) {
      this.rows = this.rows.sort((a: TRow, b: TRow) => sortFn(a, b, this.sorting.order));
      this.updatePagedData();
      return;
    }

    this.rows.sort((a: TRow, b: TRow) => {
      const valueA = (a as { [key: string]: unknown })[column];
      const valueB = (b as { [key: string]: unknown })[column];
      const isStrings = typeof valueA === 'string' && typeof valueB === 'string';
      const isNumbers = typeof valueA === 'number' && typeof valueB === 'number';

      if (this.isLuxonDateTime(valueA) && this.isLuxonDateTime(valueB)) {
        // if both values are luxon DateTime, compare them as DateTime
        return this.compareDates(column, valueA as DateTime, valueB as DateTime);
      } else if (isStrings && this.isDateTime(valueA) && this.isDateTime(valueB)) {
        // if both values are strings and luxon DateTime, compare them as DateTime
        return this.compareDates(column, DateTime.fromISO(valueA).toUTC(), DateTime.fromISO(valueB).toUTC());
      }
      // TO DO: To be removed and then passed in as custom sort function by the parent component
      else if (column === 'courtroom' && isStrings && this.isNumeric(valueA) && this.isNumeric(valueB)) {
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

  private isBoolean(valueA: unknown, valueB: unknown): boolean {
    return typeof valueA === 'boolean' && typeof valueB === 'boolean';
  }

  isRowSelected(row: TRow) {
    return this.selectedRows.includes(row);
  }

  toggleRowSelection(row: TRow) {
    const index = this.selectedRows.indexOf(row);
    if (index === -1) {
      // Row not selected, add it to the selection
      this.selectedRows.push(row);
    } else {
      // Row already selected, remove it from the selection
      this.selectedRows.splice(index, 1);
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
    return DateTime.fromISO(value).toUTC().isValid;
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
