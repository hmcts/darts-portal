import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change visibility of specific datepicker to true, and date range datepicker to false.', fakeAsync(() => {
    spyOn(component, 'onItemChange').and.callThrough();
    spyOn(component, 'toggleRadioSelected').and.callThrough();
    const radio: HTMLInputElement = fixture.debugElement.query(
      By.css('input[name="specific-date-radio"]')
    ).nativeElement;
    radio.click();
    tick();

    expect(component.onItemChange).toHaveBeenCalled();
    expect(component.toggleRadioSelected).toHaveBeenCalled();
    expect(component.specificShow).toBe(true);
    expect(component.rangeShow).toBe(false);
  }));

  it('should change visibility of range datepicker to true, and specific datepicker to false', fakeAsync(() => {
    spyOn(component, 'onItemChange').and.callThrough();
    spyOn(component, 'toggleRadioSelected').and.callThrough();
    const radio: HTMLInputElement = fixture.debugElement.query(By.css('input[name="date-range-radio"]')).nativeElement;
    radio.click();
    tick();

    expect(component.onItemChange).toHaveBeenCalled();
    expect(component.toggleRadioSelected).toHaveBeenCalled();
    expect(component.specificShow).toBe(false);
    expect(component.rangeShow).toBe(true);
  }));
});
