import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DateTime } from 'luxon';
import { CourthouseComponent } from './courthouse.component';

describe('CourthouseComponent', () => {
  let component: CourthouseComponent;
  let fixture: ComponentFixture<CourthouseComponent>;

  const courts = [
    { courthouseName: 'Reading', id: 0, createdDateTime: DateTime.now() },
    { courthouseName: 'Slough', id: 1, createdDateTime: DateTime.now() },
    { courthouseName: 'Ascot', id: 2, createdDateTime: DateTime.now() },
  ] as Courthouse[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourthouseComponent],
    });
    fixture = TestBed.createComponent(CourthouseComponent);
    component = fixture.componentInstance;
    component.courthouses = courts;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('AccessibleAutocomplete props', () => {
    it('should have correct default properties', () => {
      fixture.detectChanges();
      expect(component.props?.id).toBe('courthouse');
      expect(component.props?.name).toBe('courthouse');
      expect(component.props?.minLength).toBe(1);
    });

    it('has correct default value if courthouse is pre-populated', () => {
      component.courthouse = 'Swansea';
      fixture.detectChanges();
      expect(component.props?.defaultValue).toBe('Swansea');
    });
  });

  describe('validation', () => {
    it('shows a single error', () => {
      component.isInvalid = true;
      component.errors = ['Courthouse error'];

      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('#courthouse-errors')).nativeElement;
      expect(error.textContent).toBe('Error: Courthouse error ');
    });

    it('shows multiple errors', () => {
      component.isInvalid = true;
      component.errors = ['Courthouse error', 'Another error'];

      fixture.detectChanges();

      const error = fixture.debugElement.queryAll(By.css('#courthouse-errors p'));
      const firstError = error[0].nativeElement.textContent;
      const secondError = error[1].nativeElement.textContent;

      expect(firstError).toBe('Error: Courthouse error ');
      expect(secondError).toBe('Error: Another error ');
    });

    it('does not show error unless invalid', () => {
      component.isInvalid = false;
      component.errors = ['Courthouse error'];

      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('#courthouse-errors'));
      expect(error).toBeNull();
    });
  });

  describe('ngOnChanges', () => {
    it('should call reset when data input changes and is not the first change', () => {
      jest.spyOn(component, 'reset');

      component.ngOnChanges({
        data: {
          currentValue: {},
          previousValue: {},
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.reset).toHaveBeenCalled();
    });

    it('should not call reset when data input changes for the first time', () => {
      jest.spyOn(component, 'reset');

      component.ngOnChanges({
        data: {
          currentValue: {},
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.reset).not.toHaveBeenCalled();
    });
  });
});
