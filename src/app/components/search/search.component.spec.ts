import { ComponentFixture, TestBed, tick, flush, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
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
    spyOn(component, 'onItemChange');
    spyOn(component, 'toggleRadioSelected');
    // //Set specific date radio to checked
    const specificRadioHtml: HTMLInputElement = fixture.debugElement.query(
      By.css('input[name="specific-date-radio"]')
    ).nativeElement;
    // const radio: HTMLInputElement = specificRadioHtml.nativeElement;
    // specificRadioHtml.triggerEventHandler('change', { target: specificRadioHtml });
    specificRadioHtml.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    tick(1 * 60 * 1000); // move time 2 minutes in a fake way
    flush();

    expect(component.onItemChange).toHaveBeenCalled();
    expect(component.toggleRadioSelected).toHaveBeenCalled();
    expect(component.specificShow).toBe(true);
    // expect(component.rangeShow).toBe(false);
  }));

  it('should change visibility of specific datepicker to true, and date range datepicker to false', fakeAsync(() => {
    spyOn(component, 'onItemChange');
    spyOn(component, 'toggleRadioSelected').and.callThrough();
    // //Set specific date radio to checked
    // let options: DebugElement[] = fixture.debugElement.queryAll(By.css('input[name="specific-date-radio"]'));
    // options[0].triggerEventHandler('change', { target: { checked: true } });
    // fixture.detectChanges();

    const mockEvent: Event = <Event>(<any>{
      target: {
        checked: true,
      },
    });

    component.onItemChange('specific', mockEvent);
    // tick(1 * 60 * 1000); // move time 2 minutes in a fake way
    // flush();

    expect(component.onItemChange).toHaveBeenCalled();
    expect(component.specificShow).toBe(true);
    // expect(component.rangeShow).toBe(false);
  }));
});
