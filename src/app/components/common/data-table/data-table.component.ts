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
import { TableBodyTemplateDirective } from 'src/app/directives/table-body-template.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterLink, TableRowTemplateDirective, TableBodyTemplateDirective],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnChanges {
  @Input() rows: unknown[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() caption = '';
  @Input() rowSelectable = false;
  @Input() pagination = true;
  @Input() pageLimit = 25;
  @Output() rowSelect = new EventEmitter<unknown[]>();

  @ContentChild(TableBodyTemplateDirective, { read: TemplateRef })
  bodyTemplate?: TemplateRef<unknown>;

  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rowTemplate?: TemplateRef<unknown>;

  selectedRows: unknown[] = [];
  pagedRows: unknown[] = [];
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

  sortTable(column: string | number): void {
    this.sorting = {
      column: column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.rows.sort((a: any, b: any) => {
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

  isRowSelected(row: unknown) {
    return this.selectedRows.includes(row);
  }

  toggleRowSelection(row: unknown) {
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

  compareStrings(column: unknown, a: string, b: string): number {
    return this.isAscSorting(column) ? a.localeCompare(b) : b.localeCompare(a);
  }

  compareNumbers(column: unknown, a: number, b: number): number {
    return this.isAscSorting(column) ? a - b : b - a;
  }

  compareDates(column: unknown, a: Date, b: Date): number {
    return this.isAscSorting(column) ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
  }

  isNumeric(num: string) {
    return !isNaN(parseFloat(String(num)));
  }

  isDescSorting(column: unknown): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  isAscSorting(column: unknown): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }

  getAriaSort(column: unknown): 'ascending' | 'descending' | 'none' {
    if (this.sorting.column === column) {
      return this.isAscSorting(column) ? 'ascending' : 'descending';
    }
    return 'none';
  }

  private updatePagedData(): void {
    this.pagedRows = this.paginate(this.rows, this.pageLimit, this.currentPage);
  }

  private paginate(array: unknown[], pageSize: number, currentPage: number) {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }
}

export interface DataTableColumn {
  name: string;
  link?: string;
  prop: string;
  sortable: boolean;
}

export interface SortingInterface {
  column: string | number | undefined;
  order: 'asc' | 'desc';
}
