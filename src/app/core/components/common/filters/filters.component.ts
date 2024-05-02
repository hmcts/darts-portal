import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Filter } from '@components/common/filters/filter.interface';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  @Input() filters!: Filter[];
  @Output() filterEvent = new EventEmitter<Filter[]>();
  @Output() clearFilterEvent = new EventEmitter<void>();
  selectedFilters: Filter[] = [];
  searchTerms: { [key: string]: string } = {};

  @ViewChildren('checkboxes') checkboxes!: QueryList<ElementRef>;

  toggleVisibility() {}

  clearFilters() {
    this.selectedFilters = [];
    this.searchTerms = {};
    this.uncheckAll();
    this.clearFilterEvent.emit();
  }

  emitFilters() {
    this.filterEvent.emit(this.selectedFilters);
  }

  selectFilter(filter: Filter, value: string) {
    const index = this.selectedFilters.findIndex((item) => item.name === filter.name);

    if (index === -1) {
      const selected: Filter = { displayName: filter.displayName, name: filter.name, values: [value] };
      if (filter.multiselect) selected.multiselect = true;
      this.selectedFilters.push(selected);
    } else {
      filter.multiselect
        ? this.selectedFilters[index].values.push(value)
        : this.selectSingle(index, filter.name, value);
    }
  }

  unselectFilter(filter: Filter, value: string) {
    const index = this.selectedFilters.findIndex((item) => item.name === filter.name && item.values.includes(value));

    if (!filter.multiselect) {
      if (index !== -1) {
        this.selectedFilters.splice(index, 1);
      }
    } else {
      //Get index in values array, if values is empty, then splice filter entirely
      const valueIndex = this.selectedFilters[index].values.findIndex((sValue) => sValue === value);
      this.selectedFilters[index].values.splice(valueIndex, 1);
      this.selectedFilters[index].values.length === 0 && this.selectedFilters.splice(index, 1);
    }
  }

  selectSingle(index: number, name: string, value: string) {
    //For non-multiselect only, selects a single checkbox and unchecks all others in that type
    this.selectedFilters[index].values = [value];
    this.uncheckAllExcept(name, value);
  }

  onCheckChanged(filter: Filter, value: string, event: Event) {
    const ischecked = (<HTMLInputElement>event.target).checked;
    ischecked ? this.selectFilter(filter, value) : this.unselectFilter(filter, value);
  }

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  uncheck(name: string, value: string) {
    this.checkboxes.forEach((element) => {
      if (name === element.nativeElement.name && value === element.nativeElement.value) {
        element.nativeElement.checked = false;
      }
    });
  }

  uncheckAllExcept(name: string, value: string) {
    this.checkboxes.forEach((element) => {
      //This unselects all checkboxes for a given type, except last selected value. Only used for single selects
      if (name === element.nativeElement.name && value !== element.nativeElement.value) {
        element.nativeElement.checked = false;
      }
    });
  }

  unselectFromTag(filter: Filter, value: string) {
    this.unselectFilter(filter, value);
    this.uncheck(filter.name, value);
  }

  getFilteredValues(filter: Filter, searchTerm: string): string[] {
    if (!searchTerm) {
      return filter.values;
    }
    return filter.values.filter((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  isChecked(name: string, value: string) {
    return Boolean(this.selectedFilters?.find((item) => item.name === name)?.values?.includes(value));
  }
}
