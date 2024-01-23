import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementRef, QueryList } from '@angular/core';
import { Filter } from './filter.interface';
import { FiltersComponent } from './filters.component';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let mockQueryList: QueryList<ElementRef>;
  let mockElementRefs: ElementRef[];

  beforeEach(async () => {
    mockElementRefs = [
      { nativeElement: { name: 'filter1', value: 'value1', checked: true } },
      { nativeElement: { name: 'filter1', value: 'value2', checked: true } },
      { nativeElement: { name: 'filter2', value: 'value3', checked: true } },
    ];

    await TestBed.configureTestingModule({
      imports: [FiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    mockQueryList = new QueryList<ElementRef>();
    mockQueryList.reset(mockElementRefs);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear all selected filters', () => {
    component.uncheckAll = jest.fn();
    component.selectedFilters = [{ displayName: 'Filter 1', name: 'Filter 1', values: ['1', '2', '3', '4'] }];
    component.clearFilters();
    expect(component.selectedFilters).toEqual([]);

    expect(component.uncheckAll).toHaveBeenCalled();
  });

  describe('#selectFilter', () => {
    it('should add a new filter if it does not exist', () => {
      const filter: Filter = { displayName: 'Filter 1', name: 'filter1', values: [] };
      component.selectFilter(filter, 'value1');

      expect(component.selectedFilters).toEqual([{ displayName: 'Filter 1', name: 'filter1', values: ['value1'] }]);
    });

    it('should add a value to an existing multiselect filter', () => {
      component.selectedFilters = [{ displayName: 'Filter 1', name: 'filter1', values: ['value1'], multiselect: true }];
      const filter: Filter = { displayName: 'Filter 1', name: 'filter1', values: [], multiselect: true };
      component.selectFilter(filter, 'value2');

      expect(component.selectedFilters).toEqual([
        { displayName: 'Filter 1', name: 'filter1', values: ['value1', 'value2'], multiselect: true },
      ]);
    });

    it('should call selectSingle for an existing non-multiselect filter', () => {
      component.selectedFilters = [{ displayName: 'Filter 1', name: 'filter1', values: ['value1'] }];
      const filter: Filter = { displayName: 'Filter 1', name: 'filter1', values: [], multiselect: false };
      component.selectSingle = jest.fn();
      component.selectFilter(filter, 'value2');

      expect(component.selectSingle).toHaveBeenCalledWith(0, 'filter1', 'value2');
    });
  });

  describe('#unselectFilter', () => {
    it('should remove a non-multiselect filter', () => {
      component.selectedFilters = [{ displayName: 'Filter 1', name: 'filter1', values: ['value1'] }];
      const filter: Filter = { displayName: 'Filter 1', name: 'filter1', values: [], multiselect: false };
      component.unselectFilter(filter, 'value1');

      expect(component.selectedFilters).toEqual([]);
    });

    it('should remove a value from a multiselect filter', () => {
      component.selectedFilters = [
        { displayName: 'Filter 1', name: 'filter1', values: ['value1', 'value2'], multiselect: true },
      ];
      const filter: Filter = { displayName: 'Filter 1', name: 'filter1', values: [], multiselect: true };
      component.unselectFilter(filter, 'value1');

      expect(component.selectedFilters).toEqual([
        { displayName: 'Filter 1', name: 'filter1', values: ['value2'], multiselect: true },
      ]);
    });

    it('should remove the filter if the last value is removed from a multiselect filter', () => {
      component.selectedFilters = [{ displayName: 'Filter 1', name: 'filter1', values: ['value1'], multiselect: true }];
      const filter: Filter = { displayName: 'Filter 1', name: 'filter1', values: [], multiselect: true };
      component.unselectFilter(filter, 'value1');

      expect(component.selectedFilters).toEqual([]);
    });
  });

  describe('#unselectFilter', () => {
    it('should update the selected filter and call uncheckAllExcept', () => {
      component.uncheckAllExcept = jest.fn();
      component.selectedFilters = [
        { displayName: 'Filter 1', name: 'filter1', values: ['value1', 'value2'] },
        { displayName: 'Filter 2', name: 'filter2', values: ['value3'] },
      ];

      const index = 0;
      const name = 'filter1';
      const newValue = 'newValue';

      component.selectSingle(index, name, newValue);
      expect(component.selectedFilters[index].values).toEqual([newValue]);
      expect(component.uncheckAllExcept).toHaveBeenCalledWith(name, newValue);
    });
  });

  describe('#onCheckChanged', () => {
    beforeEach(async () => {
      component.selectFilter = jest.fn();
      component.unselectFilter = jest.fn();
    });

    it('should call selectFilter when checkbox is checked', () => {
      const mockEvent = { target: { checked: true } } as unknown as Event;
      const mockFilter = { displayName: 'Filter 1', name: 'filter1', values: ['value1'] };
      const mockValue = 'value1';

      component.onCheckChanged(mockFilter, mockValue, mockEvent);

      expect(component.selectFilter).toHaveBeenCalledWith(mockFilter, mockValue);
      expect(component.unselectFilter).not.toHaveBeenCalled();
    });

    it('should call unselectFilter when checkbox is unchecked', () => {
      const mockEvent = { target: { checked: false } } as unknown as Event;
      const mockFilter = { displayName: 'Filter 1', name: 'filter1', values: ['value1'] };
      const mockValue = 'value1';

      component.onCheckChanged(mockFilter, mockValue, mockEvent);

      expect(component.unselectFilter).toHaveBeenCalledWith(mockFilter, mockValue);
      expect(component.selectFilter).not.toHaveBeenCalled();
    });
  });
  describe('#uncheck', () => {
    beforeEach(async () => {
      component = new FiltersComponent();
      component.checkboxes = mockQueryList;
    });

    it('should uncheck all checkboxes', () => {
      component.uncheckAll();

      mockElementRefs.forEach((mockCheckbox) => {
        expect(mockCheckbox.nativeElement.checked).toBe(false);
      });
    });

    it('should uncheck specific checkbox', () => {
      component.uncheck('filter1', 'value1');

      expect(mockElementRefs[0].nativeElement.checked).toBe(false);
      expect(mockElementRefs[1].nativeElement.checked).toBe(true);
    });

    it('should uncheck all except specific checkbox', () => {
      component.uncheckAllExcept('filter1', 'value1');

      expect(mockElementRefs[0].nativeElement.checked).toBe(true);
      expect(mockElementRefs[1].nativeElement.checked).toBe(false);
    });
  });

  describe('#uncheck', () => {
    it('should call unselectFilter and uncheck with correct arguments', () => {
      component.unselectFilter = jest.fn();
      component.uncheck = jest.fn();
      const mockFilter = { displayName: 'Filter 1', name: 'filter1', values: ['value1'] };
      const mockValue = 'value1';

      component.unselectFromTag(mockFilter, mockValue);

      expect(component.unselectFilter).toHaveBeenCalledWith(mockFilter, mockValue);
      expect(component.uncheck).toHaveBeenCalledWith(mockFilter.name, mockValue);
    });
  });

  describe('#getFilteredValues', () => {
    it('should return all values when the search term is empty', () => {
      const filter: Filter = { name: 'fruit', displayName: 'Fruit selection', values: ['Apple', 'Banana', 'Orange'] };
      const results = component.getFilteredValues(filter, '');
      expect(results).toEqual(['Apple', 'Banana', 'Orange']);
    });

    it('should return filtered values when the search term is not empty', () => {
      const filter: Filter = { name: 'fruit', displayName: 'Fruit selection', values: ['Apple', 'Banana', 'Orange'] };
      const results = component.getFilteredValues(filter, 'an');
      expect(results).toEqual(['Banana', 'Orange']);
    });

    it('should return an empty array when no values match the search term', () => {
      const filter: Filter = { name: 'fruit', displayName: 'Fruit selection', values: ['Apple', 'Banana', 'Orange'] };
      const results = component.getFilteredValues(filter, 'xyz');
      expect(results).toEqual([]);
    });
  });
});
