import { CommonModule } from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@common/pagination/pagination.component';
import { DatatableColumn } from '@darts-types/index';
import { DateTime } from 'luxon';
import { TableBodyTemplateDirective } from 'src/app/directives/table-body-template.directive';
import { TableRowTemplateDirective } from 'src/app/directives/table-row-template.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterLink, TableRowTemplateDirective, TableBodyTemplateDirective],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<TRow> implements OnChanges {
  @Input() rows: TRow[] = [];
  @Input() columns: DatatableColumn[] = [];
  @Input() caption = '';
  @Input() rowSelectable = false;
  @Input() pagination = true;
  @Input() pageLimit = 25;
  @Output() rowSelect = new EventEmitter<TRow[]>();

  @ContentChild(TableBodyTemplateDirective, { read: TemplateRef })
  bodyTemplate?: TemplateRef<unknown>;

  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rowTemplate?: TemplateRef<TRow>;

  selectedRows: TRow[] = [];
  pagedRows: TRow[] = [];
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

  sortTable(column: string): void {
    this.sorting = {
      column: column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
    };

    this.rows.sort((a: TRow, b: TRow) => {
      const valueA = (a as { [key: string]: unknown })[column];
      const valueB = (b as { [key: string]: unknown })[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        if (this.isDateTime(valueA) && this.isDateTime(valueB)) {
          return this.compareDates(column, DateTime.fromISO(valueA).toUTC(), DateTime.fromISO(valueB).toUTC());
        }
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
  }

  onSelectAllChanged(checked: boolean) {
    if (checked) {
      this.selectedRows = [...this.rows];
    } else {
      this.selectedRows = [];
    }
    this.rowSelect.emit(this.selectedRows);
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

  getAriaSort(column: string): 'ascending' | 'descending' | 'none' {
    if (this.sorting.column === column) {
      return this.isAscSorting(column) ? 'ascending' : 'descending';
    }
    return 'none';
  }

  private updatePagedData(): void {
    this.pagedRows = this.paginate(this.rows, this.pageLimit, this.currentPage);
  }

  private paginate(array: TRow[], pageSize: number, currentPage: number) {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }
}

export interface SortingInterface {
  column: string;
  order: 'asc' | 'desc';
}
