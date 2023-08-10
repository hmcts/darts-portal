import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [ReactiveFormsModule, FormsModule],
    });
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change visibility of specific datepicker to true, and date range datepicker to false.', fakeAsync(() => {
    spyOn(component, 'toggleRadioSelected').and.callThrough();
    const radio: HTMLInputElement = fixture.debugElement.query(
      By.css('input[name="specific-date-radio"]')
    ).nativeElement;
    radio.click();
    tick();

    expect(component.toggleRadioSelected).toHaveBeenCalled();
    expect(component.dateInputType).toBe('specific');
  }));

  it('should change visibility of range datepicker to true, and specific datepicker to false', fakeAsync(() => {
    spyOn(component, 'toggleRadioSelected').and.callThrough();
    const radio: HTMLInputElement = fixture.debugElement.query(By.css('input[name="date-range-radio"]')).nativeElement;
    radio.click();
    tick();

    expect(component.toggleRadioSelected).toHaveBeenCalled();
    expect(component.dateInputType).toBe('range');
  }));

  it('should clear search text', () => {
    const search = component.form.controls['searchText'];
    search.setValue('search example text');

    component.clearSearch();
    expect(search.value).toBeFalsy();
  });
});
