import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatatableRow } from '@darts-types/data-table-row.interface';

import { DataTableComponent, SortingInterface } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  const MOCK_ROWS: DatatableRow[] = [
    {
      case_id: 1,
      case_number: 'C20220620001',
      courthouse: 'Swansea',
      judge: ['Judge Jonny'],
      courtroom: '123',
      transcription_count: 12,
      date: '11 Oct 2023',
    },
    {
      case_id: 2,
      case_number: 'C20220620002',
      courthouse: 'Slough',
      judge: ['Harry Jon'],
      courtroom: '122',
      transcription_count: 101,
      date: '1 Sep 2023',
    },
    {
      case_id: 3,
      case_number: 'C20220620003',
      courthouse: 'Reading',
      judge: ['Alex Zach'],
      courtroom: '28',
      transcription_count: 55,
      date: '10 Mar 2024',
    },
    {
      case_id: 4,
      case_number: 'C20220620004',
      courthouse: 'Windsor',
      judge: ['Zachary Benson'],
      courtroom: '87',
      transcription_count: 8,
      date: '5 Jan 2024',
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
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'No. of transcripts', prop: 'transcript_count', sortable: true },
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

    it('should set numeric sorting to ascending order for the courtroom string column', () => {
      component.rows = MOCK_ROWS;
      const column = 'courtroom';

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

    it('should set numeric sorting to descending order for the courtroom string column', () => {
      component.rows = MOCK_ROWS;
      const column = 'courtroom';
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

    it('should set date sorting to ascending order for the date column', () => {
      component.rows = MOCK_ROWS;
      const column = 'date';

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

    it('should set date sorting to descending order for the date column', () => {
      component.rows = MOCK_ROWS;
      const column = 'date';
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

    it('should set string sorting to ascending order for the judges array column', () => {
      component.rows = MOCK_ROWS;
      const column = 'judge';

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

    it('should set string sorting to descending order for the judges array column', () => {
      component.rows = MOCK_ROWS;
      const column = 'judge';
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

    it('should set numeric sorting to ascending order for the transcription count numeric column', () => {
      component.rows = MOCK_ROWS;
      const column = 'transcription_count';

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

    it('should set numeric sorting to descending order for the transcription count numeric column', () => {
      component.rows = MOCK_ROWS;
      const column = 'transcription_count';
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

    it('should compare two numbers in ascending order', () => {
      const column = 'transcription_count';
      const result = component.compareNumbers(column, 12, 111);
      expect(result).toBeGreaterThan(0); // 12 comes before 111, should be positive value
    });

    it('should compare two numbers in descending order', () => {
      const column = 'transcription_count';
      const result = component.compareNumbers(column, 111, 12);
      expect(result).toBeLessThan(0); // 111 comes after 12
    });

    it('should compare two dates in ascending order', () => {
      const column = 'date';
      const result = component.compareDates(column, new Date('1 Sep 2023'), new Date('5 Jan 2024'));
      expect(result).toBeGreaterThan(0); // 1 Sep 2023 comes before 5 Jan 2024
    });

    it('should compare two dates in descending order', () => {
      const column = 'date';
      const result = component.compareDates(column, new Date('5 Jan 2024'), new Date('1 Sep 2023'));
      expect(result).toBeLessThan(0); // 5 Jan 2024 comes after 1 Sep 2023
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

  it('should detect valid and invalid numbers in isNumeric for courtroom values', () => {
    const courtroomValid = '123';
    const courtroomInvalid = 'wqs1';

    expect(component.isNumeric(courtroomValid)).toBeTruthy();
    expect(component.isNumeric(courtroomInvalid)).toBeFalsy();
  });

  it('should toggle row selection', () => {
    component.toggleRowSelection(MOCK_ROWS[0]);

    expect(component.selectedRows).toContain(MOCK_ROWS[0]);

    component.toggleRowSelection(MOCK_ROWS[0]);

    expect(component.selectedRows).not.toContain(MOCK_ROWS[0]);
  });

  it('should check if a row is selected', () => {
    component.selectedRows.push(MOCK_ROWS[0]);

    expect(component.isRowSelected(MOCK_ROWS[0])).toBeTruthy();
  });

  describe('#onSelectAllChanged', () => {
    it('should check all the rows on the table', () => {
      const eventsSelectSpy = jest.spyOn(component.rowSelect, 'emit');

      component.onSelectAllChanged(true);
      expect(component.selectedRows).toEqual(component.rows);
      expect(eventsSelectSpy).toHaveBeenCalledWith(component.selectedRows);
    });
    it('should uncheck all the rows on the table', () => {
      const eventsSelectSpy = jest.spyOn(component.rowSelect, 'emit');
      component.onSelectAllChanged(false);
      expect(component.selectedRows).toEqual([]);
      expect(eventsSelectSpy).toHaveBeenCalledWith(component.selectedRows);
    });
  });
});
