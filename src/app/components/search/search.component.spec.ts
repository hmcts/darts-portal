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
import { ErrorHandlerService } from '../../services/error/error-handler.service';

describe('SearchComponent', () => {
  const fakeAppInsightsService = {};
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let caseService: CaseService;

  beforeEach(() => {
    // const spy = jasmine.createSpyObj('CaseService', {
    //   getCasesAdvanced: mockCases,
    // });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['err']);
    caseService = new CaseService(httpClientSpy, errorHandlerSpy);

    TestBed.configureTestingModule({
      declarations: [SearchComponent, ResultsComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
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

  describe('#toggleRadioSelected', () => {
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
      spyOn(component, 'onSubmit').and.callThrough();
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should call submit function when search button is clicked and fields are filled', () => {
      spyOn(component, 'onSubmit').and.callThrough();

      const search = component.form.controls['case_number'];
      const case_number = '1';
      search.setValue(case_number);
      const ch = component.form.controls['courthouse'];
      const courthouse = 'Reading';
      ch.setValue(courthouse);
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
      expect(ch.value).toBe(courthouse);
      expect(cr.value).toBe(courtroom);
      expect(jn.value).toBe(judge_name);
      expect(dn.value).toBe(defendant_name);
      expect(dt.value).toBe(date_to);
      expect(df.value).toBe(date_from);
      expect(kw.value).toBe(event_text_contains);

      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();

      //Can check case data once mock controller is implemented

      //HttpParams check in case service
      expect(caseService.getHttpParams().get('case_number')).toBe(case_number);
      expect(caseService.getHttpParams().get('courthouse')).toBe(courthouse);
      expect(caseService.getHttpParams().get('courtroom')).toBe(courtroom);
      expect(caseService.getHttpParams().get('judge_name')).toBe(judge_name);
      expect(caseService.getHttpParams().get('defendant_name')).toBe(defendant_name);
      expect(caseService.getHttpParams().get('date_to')).toBe(date_to);
      expect(caseService.getHttpParams().get('event_text_contains')).toBe(event_text_contains);

      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('#clearSearch', () => {
    it('should clear search text and results', () => {
      const search = component.form.controls['case_number'];
      const case_number = '1';
      search.setValue(case_number);
      const ch = component.form.controls['courthouse'];
      const courthouse = 'Reading';
      ch.setValue(courthouse);
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
      expect(ch.value).toBeFalsy();
      expect(cr.value).toBeFalsy();
      expect(jn.value).toBeFalsy();
      expect(dn.value).toBeFalsy();
      expect(dt.value).toBeFalsy();
      expect(df.value).toBeFalsy();
      expect(kw.value).toBeFalsy();
      expect(component.cases.length).toBe(0);
    });
  });
});
