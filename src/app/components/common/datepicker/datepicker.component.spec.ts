import * as scottishGovernment from '@scottish-government/pattern-library/src/all';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';

// Mock the initAll function
jest.mock('@scottish-government/pattern-library/src/all', () => ({
  initAll: jest.fn(),
}));

describe('AudioPlayerComponent', () => {
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

  it('should initialise Scottish Government Pattern Library', () => {
    component.ngAfterViewChecked();
    const spy = jest.spyOn(scottishGovernment, 'initAll');
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
    it('should emit the value event', () => {
      const dateValue = '01/01/2024';
      const stateChangeSpy = jest.spyOn(component.dateChange, 'emit');

      component.setDateValue(dateValue);

      expect(stateChangeSpy).toHaveBeenCalledWith(dateValue);
    });
  });
});
