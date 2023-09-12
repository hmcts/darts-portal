import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppInsightsService } from '../../services/app-insights/app-insights.service';
import { ResultsComponent } from './results/results.component';
import { CaseService } from '../../services/case/case.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CourthouseComponent } from '../common/courthouse/courthouse.component';
import { Component } from '@angular/core';
import { CourthouseData } from 'src/app/types/courthouse';

// Mock the initAll function
jest.mock('@scottish-government/pattern-library/src/all', () => ({
  initAll: jest.fn(),
}));

// Stub Courthouse field component
@Component({
  selector: 'app-courthouse-field',
  template: `<input id="courthouse" name="courthouse" type="text" />`,
  standalone: true,
})
class CourthouseStubComponent {}

describe('SearchComponent', () => {
  const fakeAppInsightsService = {};
  let httpClientSpy: HttpClient;
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let caseService: CaseService;

  const courts = [
    { courthouse_name: 'Reading', id: 0, created_date_time: 'mock' },
    { courthouse_name: 'Slough', id: 1, created_date_time: 'mock' },
    { courthouse_name: 'Ascot', id: 2, created_date_time: 'mock' },
  ] as CourthouseData[];

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    caseService = new CaseService(httpClientSpy);
    jest.spyOn(caseService, 'getCasesAdvanced').mockReturnValue(of([]));
    jest.spyOn(caseService, 'getCourthouses').mockReturnValue(of(courts));

    TestBed.overrideComponent(SearchComponent, {
      add: {
        imports: [CourthouseStubComponent],
      },
      remove: {
        imports: [CourthouseComponent],
      },
    });
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule, SearchComponent, ResultsComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: CaseService, useValue: caseService },
      ],
    });
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#triggerEventHandler', () => {
    it('should assign the value from the specific date picker to the input box, for Angular change detection, date_from and date_to should match.', async () => {
      const fixture = TestBed.createComponent(SearchComponent);
      fixture.detectChanges();

      // click on the specific radio button
      jest.spyOn(component, 'toggleRadioSelected');
      const radio: HTMLInputElement = fixture.debugElement.query(
        By.css('input[name="specific-date-radio"]')
      ).nativeElement;
      radio.click();

      fixture.detectChanges();

      const specificDateInput = fixture.debugElement.query(By.css('#specific-date'));
      specificDateInput.triggerEventHandler('change', { target: { value: '23/08/2023' } });
      const el = specificDateInput.nativeElement;

      fixture.detectChanges();
      component.setInputValue('23/08/2023', 'date_to');
      expect(el.value).toEqual('23/08/2023');
      //With specific date picker, date_from and date_to should equal the same
      expect(component.form.controls['date_to'].value).toEqual('23/08/2023');
    });

    it('should assign the value from the range date picker in the date_to input to the input box, for Angular change detection', async () => {
      const fixture = TestBed.createComponent(SearchComponent);
      fixture.detectChanges();

      // click on the range radio button
      jest.spyOn(component, 'toggleRadioSelected');
      const radio: HTMLInputElement = fixture.debugElement.query(
        By.css('input[name="date-range-radio"]')
      ).nativeElement;
      radio.click();

      fixture.detectChanges();

      const rangeDateInput = fixture.debugElement.query(By.css('#range-date-to'));
      rangeDateInput.triggerEventHandler('change', { target: { value: '23/08/2023' } });
      const el = rangeDateInput.nativeElement;

      fixture.detectChanges();

      expect(el.value).toEqual('23/08/2023');
    });
  });

  describe('#toggleRadioSelected', () => {
    it('should change visibility of specific datepicker to true, and date range datepicker to false.', fakeAsync(() => {
      jest.spyOn(component, 'toggleRadioSelected');
      const radio: HTMLInputElement = fixture.debugElement.query(
        By.css('input[name="specific-date-radio"]')
      ).nativeElement;
      radio.click();

      expect(component.toggleRadioSelected).toHaveBeenCalled();
      expect(component.dateInputType).toBe('specific');
    }));

    it('should change visibility of range datepicker to true, and specific datepicker to false', fakeAsync(() => {
      jest.spyOn(component, 'toggleRadioSelected');
      const radio: HTMLInputElement = fixture.debugElement.query(
        By.css('input[name="date-range-radio"]')
      ).nativeElement;
      radio.click();
      tick();

      expect(component.toggleRadioSelected).toHaveBeenCalled();
      expect(component.dateInputType).toBe('range');
    }));
  });

  describe('#submit', () => {
    //Below can be amended appropriately as part of validation ticket
    it('should submit when search button is clicked', () => {
      jest.spyOn(component, 'onSubmit');
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should call submit function when search button is clicked and fields are filled', () => {
      jest.spyOn(component, 'onSubmit');

      component.form.controls['case_number'].setValue('1');
      component.form.controls['courthouse'].setValue('Reading');
      component.form.controls['courtroom'].setValue('2');
      component.form.controls['judge_name'].setValue('Judy');
      component.form.controls['defendant_name'].setValue('Dave');
      component.form.controls['date_to'].setValue('18/09/2023');
      component.form.controls['date_from'].setValue('19/09/2023');
      component.form.controls['event_text_contains'].setValue('Keywords');

      //Check form control values
      expect(component.form.get('case_number')?.value).toBe('1');
      expect(component.form.get('courthouse')?.value).toBe('Reading');
      expect(component.form.get('courtroom')?.value).toBe('2');
      expect(component.form.get('judge_name')?.value).toBe('Judy');
      expect(component.form.get('defendant_name')?.value).toBe('Dave');
      expect(component.form.get('date_to')?.value).toBe('18/09/2023');
      expect(component.form.get('date_from')?.value).toBe('19/09/2023');
      expect(component.form.get('event_text_contains')?.value).toBe('Keywords');

      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();

      expect(caseService.getCasesAdvanced).toHaveBeenCalledTimes(1);
      const params = (caseService.getCasesAdvanced as jest.Mock).mock.calls[0];
      expect(params[0]).toBe('1');
      expect(params[1]).toBe('Reading');
      expect(params[2]).toBe('2');
      expect(params[3]).toBe('Judy');
      expect(params[4]).toBe('Dave');
      expect(params[5]).toBe('19/09/2023');
      expect(params[6]).toBe('18/09/2023');
      expect(params[7]).toBe('Keywords');

      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('#clearSearch', () => {
    it('should clear search text and results', () => {
      component.form.controls['case_number'].setValue('1');
      component.form.controls['courthouse'].setValue('Reading');
      component.form.controls['courtroom'].setValue('2');
      component.form.controls['judge_name'].setValue('Judy');
      component.form.controls['defendant_name'].setValue('Dave');
      component.form.controls['date_to'].setValue('18/09/2023');
      component.form.controls['date_from'].setValue('19/09/2023');
      component.form.controls['event_text_contains'].setValue('Keywords');

      component.clearSearch();

      expect(component.form.get('case_number')?.value).toBeFalsy();
      expect(component.form.get('courthouse')?.value).toBeFalsy();
      expect(component.form.get('courtroom')?.value).toBeFalsy();
      expect(component.form.get('judge_name')?.value).toBeFalsy();
      expect(component.form.get('defendant_name')?.value).toBeFalsy();
      expect(component.form.get('date_to')?.value).toBeFalsy();
      expect(component.form.get('date_from')?.value).toBeFalsy();
      expect(component.form.get('event_text_contains')?.value).toBeFalsy();
      expect(component.cases.length).toBe(0);
    });
  });
});
