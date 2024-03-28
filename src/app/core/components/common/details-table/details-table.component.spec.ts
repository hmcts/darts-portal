import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTableComponent } from './details-table.component';

describe('DetailsTableComponent', () => {
  let component: DetailsTableComponent<object>;
  let fixture: ComponentFixture<DetailsTableComponent<object>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#isNotNullUndefinedOrEmptyString', () => {
    it('Should return false if empty', () => {
      const result = component.isNotNullUndefinedOrEmptyString('');
      expect(result).toBe(false);
    });

    it('Should return false if null', () => {
      const result = component.isNotNullUndefinedOrEmptyString(null);
      expect(result).toBe(false);
    });

    it('Should return false if undefined', () => {
      const result = component.isNotNullUndefinedOrEmptyString(undefined);
      expect(result).toBe(false);
    });

    it('Should return true if OK', () => {
      const result = component.isNotNullUndefinedOrEmptyString('Aha!');
      expect(result).toBe(true);
    });
  });

  describe('#originalOrder', () => {
    it('Should return empty array if string', () => {
      const result = component.getLinkArray('hello');
      expect(result).toEqual([]);
    });
    it('Should return same DetailsTableLink array if array', () => {
      const array = [{ href: 'test', value: 'hello' }];
      const result = component.getLinkArray(array);
      expect(result).toEqual(array);
    });
  });
});
