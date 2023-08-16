import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppInsightsService } from '../../services/app-insights/app-insights.service';
import { ResultsComponent } from './results/results.component';

describe('SearchComponent', () => {
  const fakeAppInsightsService = {};
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent, ResultsComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
      providers: [{ provide: AppInsightsService, useValue: fakeAppInsightsService }],
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

  it('should submit when search button is clicked', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call submit function when search button is clicked and fields are filled', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const search = component.form.controls['case_number'];
    search.setValue('1');
    const ch = component.form.controls['courthouse'];
    ch.setValue('Reading');
    const cr = component.form.controls['courtroom'];
    cr.setValue('2');
    const jn = component.form.controls['judge_name'];
    jn.setValue('Judy');
    const dn = component.form.controls['defendant_name'];
    dn.setValue('Dave');
    const dt = component.form.controls['date_to'];
    dt.setValue('18/09/2023');
    const df = component.form.controls['date_from'];
    df.setValue('19/09/2023');
    const kw = component.form.controls['event_text_contains'];
    kw.setValue('Keywords');

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should clear search text and results', () => {
    const search = component.form.controls['case_number'];
    search.setValue('search example text');

    component.clearSearch();
    expect(search.value).toBeFalsy();
    expect(component.cases.length).toBe(0);
  });
});
