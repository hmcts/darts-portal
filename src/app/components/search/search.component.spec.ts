import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { AppInsightsService } from '../../services/app-insights/app-insights.service';
import { ResultsComponent } from './results/results.component';
import { CaseService } from '../../services/case/case.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { CourthouseData } from 'src/app/types/courthouse';
import { of, throwError } from 'rxjs';

// Mock the initAll function
jest.mock('@scottish-government/pattern-library/src/all', () => ({
  initAll: jest.fn(),
}));

describe('SearchComponent', () => {
  const fakeAppInsightsService = {};
  let httpClientSpy: HttpClient;
  let errorHandlerSpy: ErrorHandlerService;
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
    errorHandlerSpy = {
      err: jest.fn(),
    } as unknown as ErrorHandlerService;
    caseService = new CaseService(httpClientSpy, errorHandlerSpy);
    //Stub getCourthouses as it runs on load
    jest.spyOn(caseService, 'getCourthouses').mockReturnValue(of(courts));

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

  describe('#assignValue', () => {
    it('should assign the value from the specific date picker to the input box, for Angular change detection', async () => {
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

      expect(el.value).toEqual('23/08/2023');
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

      const search = component.form.controls['case_number'];
      const case_number = '1';
      search.setValue(case_number);
      const courthouse = 'Reading';
      const ch = fixture.debugElement.query(By.css('input[name="courthouse"]'));
      ch.nativeElement.value = courthouse;
      ch.nativeElement.dispatchEvent(new Event('input'));
      const cr = component.form.controls['courtroom'];
      const courtroom = '2';
      cr.setValue(courtroom);
      const jn = component.form.controls['judge_name'];
      const judge_name = 'Judy';
      jn.setValue(judge_name);
      const dn = component.form.controls['defendant_name'];
      const defendant_name = 'Dave';
      dn.setValue(defendant_name);
      const dt = component.form.controls['date_to'];
      const date_to = '18/09/2023';
      dt.setValue(date_to);
      const df = component.form.controls['date_from'];
      const date_from = '19/09/2023';
      df.setValue(date_from);
      const kw = component.form.controls['event_text_contains'];
      const event_text_contains = 'Keywords';
      kw.setValue(event_text_contains);

      //Check form control values
      expect(search.value).toBe(case_number);
      expect(ch.nativeElement.value).toBe(courthouse);
      expect(cr.value).toBe(courtroom);
      expect(jn.value).toBe(judge_name);
      expect(dn.value).toBe(defendant_name);
      expect(dt.value).toBe(date_to);
      expect(df.value).toBe(date_from);
      expect(kw.value).toBe(event_text_contains);

      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();

      //HttpParams check in case service
      expect(caseService.getHttpParams().get('case_number')).toBe(case_number);
      expect(caseService.getHttpParams().get('courthouse')).toBe(courthouse);
      expect(caseService.getHttpParams().get('courtroom')).toBe(courtroom);
      expect(caseService.getHttpParams().get('judge_name')).toBe(judge_name);
      expect(caseService.getHttpParams().get('defendant_name')).toBe(defendant_name);
      expect(caseService.getHttpParams().get('date_to')).toBe('2023-09-18');
      expect(caseService.getHttpParams().get('event_text_contains')).toBe(event_text_contains);

      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('#clearSearch', () => {
    it('should clear search text and results', () => {
      const search = component.form.controls['case_number'];
      const case_number = '1';
      search.setValue(case_number);
      const courthouse = 'Reading';
      const ch = fixture.debugElement.query(By.css('input[name="courthouse"]'));
      ch.nativeElement.value = courthouse;
      ch.nativeElement.dispatchEvent(new Event('input'));
      const cr = component.form.controls['courtroom'];
      const courtroom = '2';
      cr.setValue(courtroom);
      const jn = component.form.controls['judge_name'];
      const judge_name = 'Judy';
      jn.setValue(judge_name);
      const dn = component.form.controls['defendant_name'];
      const defendant_name = 'Dave';
      dn.setValue(defendant_name);
      const dt = component.form.controls['date_to'];
      const date_to = '18/09/2023';
      dt.setValue(date_to);
      const df = component.form.controls['date_from'];
      const date_from = '19/09/2023';
      df.setValue(date_from);
      const kw = component.form.controls['event_text_contains'];
      const event_text_contains = 'Keywords';
      kw.setValue(event_text_contains);

      component.clearSearch();
      expect(search.value).toBeFalsy();
      expect(ch.nativeElement.value).toBeFalsy();
      expect(cr.value).toBeFalsy();
      expect(jn.value).toBeFalsy();
      expect(dn.value).toBeFalsy();
      expect(dt.value).toBeFalsy();
      expect(df.value).toBeFalsy();
      expect(kw.value).toBeFalsy();
      expect(component.cases.length).toBe(0);
    });
  });

  describe('#returnCourthouseNames', () => {
    it('should return courthouse_name array from object array', () => {
      const namesArr = component.returnCourthouseNames(courts);
      const equalArr = ['Reading', 'Slough', 'Ascot'];
      expect(namesArr).toEqual(equalArr);
    });
  });

  describe('#AccessibleAutocompleteProps', () => {
    it('should have correct default properties', () => {
      const id = 'advanced-case-search';
      const minLength = 1;
      const name = 'courthouse';

      expect(component.props.id).toBe(id);
      expect(component.props.minLength).toBe(minLength);
      expect(component.props.name).toBe(name);
    });
  });

  describe('#getCourthouses', () => {
    it('should load courthouses and set autocomplete element', () => {
      const getCourthousesSpy = jest.spyOn(component, 'getCourthouses');
      component.ngAfterViewInit();

      expect(component.props.element).toBeTruthy();
      expect(component.props.source).toBeTruthy();
      expect(component.courthouses).toEqual(courts);

      expect(getCourthousesSpy).toHaveBeenCalled();
    });

    it('should run get courthouses function and return 404 response and errorType should be CASE_TEST and loaded', () => {
      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.`, type: 'type' },
        status: 404,
        statusText: 'Not Found',
      });

      caseService.getCourthouses = jest.fn().mockReturnValue(throwError(() => errorResponse));

      component.getCourthouses();

      expect(component.errorType).toEqual(errorResponse.error.type);
      expect(component.loaded).toBeTruthy();
    });
  });
});
