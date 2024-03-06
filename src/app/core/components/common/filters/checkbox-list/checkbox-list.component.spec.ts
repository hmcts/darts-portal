import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl } from '@angular/forms';
import { CheckboxListItem } from './checkbox-list-item.type';
import { CheckboxListComponent } from './checkbox-list.component';

describe('CheckboxFilterComponent', () => {
  let component: CheckboxListComponent;
  let fixture: ComponentFixture<CheckboxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit filterChange event when checkboxes are changed', () => {
    const checkbox1 = { id: 1, name: 'checkbox1' };
    const checkbox2 = { id: 2, name: 'checkbox2' };
    component.checkboxes = [checkbox1, checkbox2];
    fixture.detectChanges();

    const formArray = component.checkboxesFormArray;
    const checkboxControl1 = formArray.at(0) as FormControl;
    const checkboxControl2 = formArray.at(1) as FormControl;

    let emittedFilterChange: CheckboxListItem[] = [];
    component.filterChange.subscribe((filter: CheckboxListItem[]) => {
      emittedFilterChange = filter;
    });

    checkboxControl1.setValue(true);
    expect(emittedFilterChange).toEqual([checkbox1]);

    checkboxControl2.setValue(true);
    expect(emittedFilterChange).toEqual([checkbox1, checkbox2]);

    checkboxControl1.setValue(false);
    expect(emittedFilterChange).toEqual([checkbox2]);

    checkboxControl2.setValue(false);
    expect(emittedFilterChange).toEqual([]);
  });

  it('should call onChange and onTouched when checkboxes are changed', () => {
    const checkbox1 = { id: 1, name: 'checkbox1' };
    const checkbox2 = { id: 2, name: 'checkbox2' };
    component.checkboxes = [checkbox1, checkbox2];
    fixture.detectChanges();

    const formArray = component.checkboxesFormArray;
    const checkboxControl1 = formArray.at(0) as FormControl;
    const checkboxControl2 = formArray.at(1) as FormControl;

    let onChangeCalled = false;
    let onTouchedCalled = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    component.onChange = (value: CheckboxListItem[]) => {
      onChangeCalled = true;
    };
    component.onTouched = () => {
      onTouchedCalled = true;
    };

    checkboxControl1.setValue(true);
    expect(onChangeCalled).toBe(true);
    expect(onTouchedCalled).toBe(true);

    onChangeCalled = false;
    onTouchedCalled = false;

    checkboxControl2.setValue(true);
    expect(onChangeCalled).toBe(true);
    expect(onTouchedCalled).toBe(true);
  });
});
