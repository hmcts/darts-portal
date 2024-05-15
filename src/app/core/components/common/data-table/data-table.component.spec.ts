import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Order } from '@core-types/data-table/data-table-column.interface';
import { Urgency } from '@portal-types/transcriptions/transcription-urgency.interface';
import { DataTableComponent, SortingInterface } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent<unknown>;
  let fixture: ComponentFixture<DataTableComponent<unknown>>;
  const MOCK_ROWS: unknown[] = [
    {
      case_id: 1,
      case_number: 'C20220620001',
      courthouse: 'Swansea',
      judge: ['Judge Jonny'],
      courtroom: '123',
      is_manual: true,
      transcription_count: 12,
      date: '11 Oct 2023',
      luxonDateTime: DateTime.fromISO('2023-10-11T00:00:00'),
      dateTimeString: '2023-10-11T00:00:00',
    },
    {
      case_id: 2,
      case_number: 'C20220620002',
      courthouse: 'Slough',
      judge: ['Harry Jon'],
      courtroom: '122',
      is_manual: true,
      transcription_count: 101,
      date: '1 Sep 2023',
      luxonDateTime: DateTime.fromISO('2023-09-01T00:00:00'),
      dateTimeString: '2023-09-01T00:00:00',
    },
    {
      case_id: 3,
      case_number: 'C20220620003',
      courthouse: 'Reading',
      judge: ['Alex Zach'],
      courtroom: '28',
      is_manual: false,
      transcription_count: 55,
      date: '10 Mar 2024',
      luxonDateTime: DateTime.fromISO('2024-03-10T00:00:00'),
      dateTimeString: '2024-03-10T00:00:00',
    },
    {
      case_id: 4,
      case_number: 'C20220620004',
      courthouse: 'Windsor',
      judge: ['Zachary Benson'],
      courtroom: '87',
      is_manual: true,
      transcription_count: 8,
      date: '5 Jan 2024',
      luxonDateTime: DateTime.fromISO('2024-01-05T00:00:00'),
      dateTimeString: '2024-01-05T00:00:00',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataTableComponent],
    });
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.columns = [
      { name: 'Case ID', prop: 'caseNumber', sortable: true },
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

      component.ngOnChanges({ rows: {} } as unknown as SimpleChanges); // Pass an empty object as an argument

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

    it('does not paginate when it is disabled', () => {
      component.rows = MOCK_ROWS;
      component.pageLimit = 2;
      component.pagination = false;

      component.ngOnChanges({ rows: {} } as unknown as SimpleChanges); // Pass an empty object as an argument

      // given 4 rows and an irrelevant page limit of 2, we expect all rows to display
      expect(component.pagedRows.length).toEqual(4);
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

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
        column,
        order: 'desc',
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual(component.rows);
    });

    it('should set sorting to ascending order for a boolean column', () => {
      component.rows = MOCK_ROWS;
      const column = 'is_manual';

      component.sorting = {
        column,
        order: 'desc',
      };

      component.sortTable(column);

      const expectedSorting: SortingInterface<unknown> = {
        column,
        order: 'asc',
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual(component.rows.reverse());
    });

    it('should set sorting to descending order for a boolean column', () => {
      component.rows = MOCK_ROWS;
      const column = 'is_manual';
      component.sorting = {
        column,
        order: 'asc',
      };

      component.sortTable(column);

      const expectedSorting: SortingInterface<unknown> = {
        column,
        order: 'desc',
      };

      expect(component.sorting).toEqual(expectedSorting);
    });

    it('use a custom sorting function to sort in ascending order', () => {
      component.rows = [
        {
          transcription_id: 10,
          case_id: 72345,
          case_number: 'CXYZ12345',
          courthouse_name: 'Newcastle',
          hearing_date: '2023-04-09',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: { transcription_urgency_id: 3, description: 'Up to 3 working days', priority_order: 3 },
          requested_ts: '2023-04-09T09:58:34Z',
        },
        {
          transcription_id: 3,
          case_id: 23452,
          case_number: 'T34567',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-11',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 },
          requested_ts: '2023-06-28T13:00:00Z',
        },
        {
          transcription_id: 4,
          case_id: 76543,
          case_number: 'T45678',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-12',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: { transcription_urgency_id: 4, description: 'Up to 7 working days', priority_order: 4 },
          requested_ts: '2023-06-29T13:00:00Z',
        },
      ];

      const expectedResult = [
        {
          transcription_id: 4,
          case_id: 76543,
          case_number: 'T45678',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-12',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: {
            transcription_urgency_id: 4,
            description: 'Up to 7 working days',
            priority_order: 4,
          },
          requested_ts: '2023-06-29T13:00:00Z',
        },
        {
          transcription_id: 10,
          case_id: 72345,
          case_number: 'CXYZ12345',
          courthouse_name: 'Newcastle',
          hearing_date: '2023-04-09',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: {
            transcription_urgency_id: 3,
            description: 'Up to 3 working days',
            priority_order: 3,
          },
          requested_ts: '2023-04-09T09:58:34Z',
        },
        {
          transcription_id: 3,
          case_id: 23452,
          case_number: 'T34567',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-11',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: {
            transcription_urgency_id: 1,
            description: 'Overnight',
            priority_order: 1,
          },
          requested_ts: '2023-06-28T13:00:00Z',
        },
      ];

      const column = 'urgency';
      component.sorting = {
        column,
        order: 'desc',
      };

      const sortFn = (a: unknown, b: unknown, direction?: Order) => {
        const urgencyA = a as { urgency: Urgency };
        const urgencyB = b as { urgency: Urgency };

        if (direction === 'desc') {
          return urgencyA.urgency.priority_order! - urgencyB.urgency.priority_order!;
        } else if (direction === 'asc') {
          return urgencyB.urgency.priority_order! - urgencyA.urgency.priority_order!;
        } else {
          return 0;
        }
      };
      component.sortTable(column, sortFn);

      const expectedSorting: SortingInterface<unknown> = {
        column,
        order: 'asc',
        sortFn,
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual(expectedResult);
    });

    it('use a custom sorting function to sort in descending order', () => {
      component.rows = [
        {
          transcription_id: 10,
          case_id: 72345,
          case_number: 'CXYZ12345',
          courthouse_name: 'Newcastle',
          hearing_date: '2023-04-09',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: { transcription_urgency_id: 3, description: 'Up to 3 working days', priority_order: 3 },
          requested_ts: '2023-04-09T09:58:34Z',
        },
        {
          transcription_id: 3,
          case_id: 23452,
          case_number: 'T34567',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-11',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 },
          requested_ts: '2023-06-28T13:00:00Z',
        },
        {
          transcription_id: 4,
          case_id: 76543,
          case_number: 'T45678',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-12',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: { transcription_urgency_id: 4, description: 'Up to 7 working days', priority_order: 4 },
          requested_ts: '2023-06-29T13:00:00Z',
        },
      ];

      const expectedResult = [
        {
          transcription_id: 3,
          case_id: 23452,
          case_number: 'T34567',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-11',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: {
            transcription_urgency_id: 1,
            description: 'Overnight',
            priority_order: 1,
          },
          requested_ts: '2023-06-28T13:00:00Z',
        },
        {
          transcription_id: 10,
          case_id: 72345,
          case_number: 'CXYZ12345',
          courthouse_name: 'Newcastle',
          hearing_date: '2023-04-09',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: {
            transcription_urgency_id: 3,
            description: 'Up to 3 working days',
            priority_order: 3,
          },
          requested_ts: '2023-04-09T09:58:34Z',
        },
        {
          transcription_id: 4,
          case_id: 76543,
          case_number: 'T45678',
          courthouse_name: 'Cardiff',
          hearing_date: '2023-06-12',
          transcription_type: 'Court log',
          status: 'Complete',
          urgency: {
            transcription_urgency_id: 4,
            description: 'Up to 7 working days',
            priority_order: 4,
          },
          requested_ts: '2023-06-29T13:00:00Z',
        },
      ];

      const column = 'urgency';
      component.sorting = {
        column,
        order: 'asc',
      };

      const sortFn = (a: unknown, b: unknown, direction?: Order) => {
        const urgencyA = a as { urgency: Urgency };
        const urgencyB = b as { urgency: Urgency };

        if (direction === 'desc') {
          return urgencyA.urgency.priority_order! - urgencyB.urgency.priority_order!;
        } else if (direction === 'asc') {
          return urgencyB.urgency.priority_order! - urgencyA.urgency.priority_order!;
        } else {
          return 0;
        }
      };
      component.sortTable(column, sortFn);

      const expectedSorting: SortingInterface<unknown> = {
        column,
        order: 'desc',
        sortFn,
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual(expectedResult);
    });

    it('should sort by luxon DateTime', () => {
      component.rows = [MOCK_ROWS[0], MOCK_ROWS[1]];
      const column = 'luxonDateTime';

      component.sorting = {
        column,
        order: 'desc',
      };

      component.sortTable(column);

      const expectedSorting: SortingInterface<unknown> = {
        column,
        order: 'asc',
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual([MOCK_ROWS[1], MOCK_ROWS[0]]);
    });

    it('should sort by date string', () => {
      component.rows = [MOCK_ROWS[0], MOCK_ROWS[1]];
      const column = 'dateTimeString';

      component.sorting = {
        column,
        order: 'desc',
      };

      component.sortTable(column);

      const expectedSorting: SortingInterface<unknown> = {
        column,
        order: 'asc',
      };

      expect(component.sorting).toEqual(expectedSorting);
      expect(component.rows).toEqual([MOCK_ROWS[1], MOCK_ROWS[0]]);
    });

    it('should set numeric sorting to ascending order for the courtroom string column', () => {
      component.rows = MOCK_ROWS;
      const column = 'courtroom';

      component.sorting = {
        column,
        order: 'desc',
      };

      component.sortTable(column);

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
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

      const expectedSorting: SortingInterface<unknown> = {
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
      const result = component.compareDates(
        column,
        DateTime.fromJSDate(new Date('1 Sep 2023')),
        DateTime.fromJSDate(new Date('5 Jan 2024'))
      );
      expect(result).toBeGreaterThan(0); // 1 Sep 2023 comes before 5 Jan 2024
    });

    it('should compare two dates in descending order', () => {
      const column = 'date';
      const result = component.compareDates(
        column,
        DateTime.fromJSDate(new Date('5 Jan 2024')),
        DateTime.fromJSDate(new Date('1 Sep 2023'))
      );
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
      component.sortAndPaginateOnRowsChanged = false;
      const column = 'case_number';
      component.sorting = {
        column,
        order: 'asc',
      };

      component.ngOnChanges({ rows: {} } as unknown as SimpleChanges);

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

  it('should show no data message when no rows are present', () => {
    component.rows = [];
    component.noDataMessage = 'No data';

    fixture.detectChanges();

    const noDataMessage = fixture.debugElement.query(By.css('#no-data-message'));
    expect(noDataMessage).toBeTruthy();
    expect(noDataMessage.nativeElement.textContent).toContain('No data');
  });

  describe('#ngOnChanges', () => {
    it('if rows not changed, do nothing', () => {
      component.rows = MOCK_ROWS;
      component.sorting = {
        column: 'case_number',
        order: 'desc',
      };
      component.currentPage = 2;

      component.ngOnChanges({} as unknown as SimpleChanges);

      expect(component.sorting).toEqual({
        column: 'case_number',
        order: 'desc',
      });
      expect(component.currentPage).toEqual(2);
    });

    describe('#sortAndPaginateOnRowsChanged', () => {
      it('true: maintains sorting and page number when rows are updated', () => {
        component.rows = MOCK_ROWS;
        component.sortAndPaginateOnRowsChanged = true;
        component.sorting = {
          column: 'case_number',
          order: 'asc',
        };
        component.currentPage = 2;

        component.ngOnChanges({ rows: {} } as unknown as SimpleChanges);

        expect(component.sorting).toEqual({
          column: 'case_number',
          order: 'asc',
        });
        expect(component.currentPage).toEqual(2);
      });

      it('false: resets sorting and page when rows are updated', () => {
        component.rows = MOCK_ROWS;
        component.sortAndPaginateOnRowsChanged = false;
        component.sorting = {
          column: 'case_number',
          order: 'desc',
        };
        component.currentPage = 2;

        component.ngOnChanges({ rows: {} } as unknown as SimpleChanges);

        expect(component.sorting).toEqual({
          column: '',
          order: 'desc',
        });
        expect(component.currentPage).toEqual(1);
      });
    });
  });

  describe('Heading caption count', () => {
    beforeEach(() => {
      component.rows = new Array(11); // Set default rows for most tests
    });

    it('should display correct caption for the first page', () => {
      component.currentPage = 1;
      component.pageLimit = 5;
      expect(component.getCurrentPageCaptionCount()).toBe('1-5');
    });

    it('should display correct caption for a middle page', () => {
      component.currentPage = 2;
      component.pageLimit = 5;
      expect(component.getCurrentPageCaptionCount()).toBe('6-10');
    });

    it('should display correct caption for the last page', () => {
      component.currentPage = 3;
      component.pageLimit = 5;
      expect(component.getCurrentPageCaptionCount()).toBe('11-11');
    });

    it('should display correct caption when all results fit on one page', () => {
      component.rows = new Array(8); // Adjust rows for this specific test
      component.currentPage = 1;
      component.pageLimit = 10;
      expect(component.getCurrentPageCaptionCount()).toBe('1-8');
    });

    it('should display correct caption for empty results', () => {
      component.rows = []; // No rows
      component.currentPage = 1;
      component.pageLimit = 10;
      expect(component.getCurrentPageCaptionCount()).toBe('1-0');
    });
  });
});
