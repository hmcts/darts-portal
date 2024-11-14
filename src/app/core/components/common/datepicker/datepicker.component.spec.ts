import * as mojFrontend from '@ministryofjustice/frontend';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';

// Mock the initAll function
jest.mock('@ministryofjustice/frontend', () => ({
  initAll: jest.fn(),
}));

describe('DatepickerComponent', () => {
  let fixture: ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatepickerComponent],
      providers: [],
    });

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise MoJ frontend', () => {
    component.ngAfterViewChecked();
    const spy = jest.spyOn(mojFrontend, 'initAll');
    expect(spy).toHaveBeenCalled();
  });

  describe('#areDateErrors', () => {
    it('should return false if array with just empty string provided', () => {
      component.errors = [''];
      const result = component.areDateErrors();
      expect(result).toEqual(false);
    });

    it('should return false if no errors provided at all', () => {
      const result = component.areDateErrors();
      expect(result).toEqual(false);
    });

    it('should return false if no errors null', () => {
      component.errors = null;
      const result = component.areDateErrors();
      expect(result).toEqual(false);
    });

    it('should return true if errors provided', () => {
      component.errors = ['I am an error!'];
      const result = component.areDateErrors();
      expect(result).toEqual(true);
    });
  });

  describe('#setDateValue', () => {
    it('should not emit the date value when the date is invalid', () => {
      const dateValue = 'abc';
      const stateChangeSpy = jest.spyOn(component.dateChange, 'emit');

      component.setDateValue(dateValue);

      expect(stateChangeSpy).not.toHaveBeenCalled();
    });

    it('should emit the date value', () => {
      const dateValue = '01/01/2024';
      const stateChangeSpy = jest.spyOn(component.dateChange, 'emit');

      component.setDateValue(dateValue);

      expect(stateChangeSpy).toHaveBeenCalledWith(dateValue);
    });

    it('zero-pads the date (day and month)', () => {
      const dateValue = '1/1/2024';
      const zeroPaddedDateValue = '01/01/2024';
      const stateChangeSpy = jest.spyOn(component.dateChange, 'emit');

      component.setDateValue(dateValue);

      expect(stateChangeSpy).toHaveBeenCalledWith(zeroPaddedDateValue);
    });

    it('zero-pads the date (day only)', () => {
      const dateValue = '1/01/2024';
      const zeroPaddedDateValue = '01/01/2024';
      const stateChangeSpy = jest.spyOn(component.dateChange, 'emit');

      component.setDateValue(dateValue);

      expect(stateChangeSpy).toHaveBeenCalledWith(zeroPaddedDateValue);
    });

    it('zero-pads the date (month only)', () => {
      const dateValue = '01/1/2024';
      const zeroPaddedDateValue = '01/01/2024';
      const stateChangeSpy = jest.spyOn(component.dateChange, 'emit');

      component.setDateValue(dateValue);

      expect(stateChangeSpy).toHaveBeenCalledWith(zeroPaddedDateValue);
    });
  });
});
