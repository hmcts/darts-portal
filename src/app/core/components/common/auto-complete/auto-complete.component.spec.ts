import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoCompleteComponent } from './auto-complete.component';

describe('AutoCompleteComponent', () => {
  let component: AutoCompleteComponent;
  let fixture: ComponentFixture<AutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoCompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoCompleteComponent);
    component = fixture.componentInstance;
    component.dataType = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onConfirm', () => {
    it('should emit selected item on confirm', () => {
      const selectedItem = { id: 1, name: 'Item 1' };
      component.data = [selectedItem];
      jest.spyOn(component.dataSelect, 'emit');
      component.ngOnInit();

      if (component.props?.onConfirm) component.props?.onConfirm(selectedItem.name);

      expect(component.dataSelect.emit).toHaveBeenCalledWith(selectedItem);
    });
  });

  it('should have form group error when invalid', () => {
    component.isInvalid = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.govuk-input--error')).toBeTruthy();
  });

  it('should configure autocomplete on view init', () => {
    jest.spyOn(component, 'configureAutoComplete');
    component.ngAfterViewInit();
    expect(component.configureAutoComplete).toHaveBeenCalled();
  });

  it('should configure autocomplete when data changes', () => {
    jest.spyOn(component, 'configureAutoComplete');
    const changes = { data: { isFirstChange: () => false } as SimpleChange };
    component.ngOnChanges(changes);
    expect(component.configureAutoComplete).toHaveBeenCalled();
  });
});
