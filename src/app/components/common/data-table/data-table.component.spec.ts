import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent, SortingInterface } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  const MOCK_ROWS: any[] = [
    {
      case_id: 1,
      case_number: 'C20220620001',
      courthouse: 'Swansea',
    },
    {
      case_id: 2,
      case_number: 'C20220620002',
      courthouse: 'Slough',
    },
    {
      case_id: 3,
      case_number: 'C20220620003',
      courthouse: 'Reading',
    },
    {
      case_id: 4,
      case_number: 'C20220620004',
      courthouse: 'Windsor',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataTableComponent],
    });
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.columns = [
      { name: 'Case ID', prop: 'caseNumber', sortable: true, link: '/case' },
      { name: 'Courthouse', prop: 'courthouse', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: false },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pagination', () => {
    it('pages cases based on page limit', () => {
      component.rows = MOCK_ROWS;
      component.currentPage = 1;
      component.pageLimit = 1;

      component.ngOnChanges();

      expect(component.pagedRows.length).toEqual(1);
    });

    it('pages cases based on current page', () => {
      // Given 4 cases and a page limit of 3 and on page 2
      component.rows = MOCK_ROWS;
      component.pageLimit = 3;

      component.onPageChanged(2);

      expect(component.pagedRows.length).toEqual(1);
      expect(component.pagedRows[0]).toEqual(MOCK_ROWS[3]);
    });
  });

  describe('Sorting', () => {
    it('should set sorting to ascending order for the given column', () => {
      component.rows = MOCK_ROWS;
      const column = 'case_number';

      component.sorting = {
        column,
        order: 'desc',
      };

      component.sortTable(column);

      const expectedSorting: SortingInterface = {
        column,
        order: 'asc',
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual(component.rows.reverse());
    });

    it('should set sorting to descending order for the given column', () => {
      component.rows = MOCK_ROWS;
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'asc',
      };

      component.sortTable(column);

      const expectedSorting: SortingInterface = {
        column,
        order: 'desc',
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual(component.rows);
    });

    it('should compare two strings in ascending order', () => {
      const column = 'case_number';
      const result = component.compareStrings(column, 'abc', 'def');
      expect(result).toBe(1); // 'abc' comes before 'def'
    });

    it('should compare two strings in descending order', () => {
      const column = 'case_number';
      const result = component.compareStrings(column, 'def', 'abc');
      expect(result).toBe(-1); // 'def' comes after 'abc'
    });

    it('should return true for isDescSorting when sorting in descending order', () => {
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'desc',
      };
      const isDesc = component.isDescSorting(column);
      expect(isDesc).toBe(true);
    });

    it('should return false for isDescSorting when sorting in ascending order', () => {
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'asc',
      };
      const isDesc = component.isDescSorting(column);
      expect(isDesc).toBe(false);
    });

    it('should return true for isAscSorting when sorting in ascending order', () => {
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'asc',
      };
      const isAsc = component.isAscSorting(column);
      expect(isAsc).toBe(true);
    });

    it('should return false for isAscSorting when sorting in descending order', () => {
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'desc',
      };
      const isAsc = component.isAscSorting(column);
      expect(isAsc).toBe(false);
    });

    it('should return "ascending" for getAriaSort when sorting in ascending order', () => {
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'asc',
      };
      const ariaSort = component.getAriaSort(column);
      expect(ariaSort).toBe('ascending');
    });

    it('should return "descending" for getAriaSort when sorting in descending order', () => {
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'desc',
      };
      const ariaSort = component.getAriaSort(column);
      expect(ariaSort).toBe('descending');
    });

    it('should return "none" for getAriaSort when not sorting the column', () => {
      const column = 'case_number';
      component.sorting = {
        column: 'other_column', // A different column
        order: 'asc',
      };
      const ariaSort = component.getAriaSort(column);
      expect(ariaSort).toBe('none');
    });

    it('should reset column sorting state on cases changed', () => {
      component.rows = MOCK_ROWS;
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'asc',
      };

      component.ngOnChanges();

      expect(component.sorting.column).toBe('');
    });
  });
});
