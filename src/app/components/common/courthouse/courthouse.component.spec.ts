import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { CourthouseComponent } from './courthouse.component';
import { CourthouseData } from '@darts-types/index';

describe('CourthouseComponent', () => {
  let component: CourthouseComponent;
  let fixture: ComponentFixture<CourthouseComponent>;

  const courts = [
    { courthouse_name: 'Reading', id: 0, created_date_time: 'mock' },
    { courthouse_name: 'Slough', id: 1, created_date_time: 'mock' },
    { courthouse_name: 'Ascot', id: 2, created_date_time: 'mock' },
  ] as CourthouseData[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourthouseComponent, HttpClientModule],
    });
    fixture = TestBed.createComponent(CourthouseComponent);
    component = fixture.componentInstance;
    component.courthouses = courts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AccessibleAutocomplete props', () => {
    it('should have correct default properties', () => {
      expect(component.props.id).toBe('courthouse');
      expect(component.props.name).toBe('courthouse');
      expect(component.props.minLength).toBe(1);
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
});
