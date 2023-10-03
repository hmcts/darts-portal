import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResultsComponent } from './results/results.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CaseService } from '@services/case/case.service';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { Courthouse } from '@darts-types/courthouse.interface';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorSummaryEntry } from '@darts-types/index';

// Mock the initAll function
jest.mock('@scottish-government/pattern-library/src/all', () => ({
  initAll: jest.fn(),
}));

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
  ] as Courthouse[];

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    caseService = new CaseService(httpClientSpy);
    jest.spyOn(caseService, 'getCasesAdvanced').mockReturnValue(of([]));
    jest.spyOn(caseService, 'getCourthouses').mockReturnValue(of(courts));

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        SearchComponent,
        ResultsComponent,
        CourthouseComponent,
      ],
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

      const specificDateInput = fixture.debugElement.query(By.css('#specific_date'));
      specificDateInput.triggerEventHandler('change', { target: { value: '23/08/2023' } });
      const el = specificDateInput.nativeElement;

      fixture.detectChanges();
      component.setInputValue('23/08/2023', 'specific_date');
      expect(el.value).toEqual('23/08/2023');
      //With specific date picker, date_from and date_to should equal the same
      expect(component.form.controls['specific_date'].value).toEqual('23/08/2023');
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

      const rangeDateInput = fixture.debugElement.query(By.css('#date_to'));
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
      const getCasesAdvancedSpy = jest.spyOn(caseService, 'getCasesAdvanced');

      component.form.controls['case_number'].setValue('1');
      component.form.controls['courthouse'].setValue('Reading');
      component.form.controls['courtroom'].setValue('2');
      component.form.controls['judge_name'].setValue('Judy');
      component.form.controls['defendant_name'].setValue('Dave');
      // component.form.controls['specific_date'].setValue('');
      component.form.controls['date_to'].setValue('18/09/2022');
      component.form.controls['date_from'].setValue('19/09/2022');
      component.form.controls['event_text_contains'].setValue('Keywords');

      component.form.markAsDirty();
      component.form.markAsTouched();

      //Check form control values
      expect(component.form.get('case_number')?.value).toBe('1');
      expect(component.form.get('courthouse')?.value).toBe('Reading');
      expect(component.form.get('courtroom')?.value).toBe('2');
      expect(component.form.get('judge_name')?.value).toBe('Judy');
      expect(component.form.get('defendant_name')?.value).toBe('Dave');
      // expect(component.form.get('specific_date')?.value).toBe('');
      expect(component.form.get('date_to')?.value).toBe('18/09/2022');
      expect(component.form.get('date_from')?.value).toBe('19/09/2022');
      expect(component.form.get('event_text_contains')?.value).toBe('Keywords');

      component.onSubmit();

      expect(getCasesAdvancedSpy).toHaveBeenCalledTimes(1);
      expect(getCasesAdvancedSpy).toBeCalledWith({
        case_number: '1',
        courthouse: 'Reading',
        courtroom: '2',
        specific_date: null,
        date_from: '19/09/2022',
        date_to: '18/09/2022',
        defendant_name: 'Dave',
        event_text_contains: 'Keywords',
        judge_name: 'Judy',
      });
    });
  });

  describe('#clearSearch', () => {
    it('should clear search text and results', () => {
      const courthouseComponentSpy = jest.spyOn(component.courthouseComponent, 'reset');
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
      expect(courthouseComponentSpy).toHaveBeenCalled();
    });
  });

  it('error summary should contain no errors when form is valid and submitted', () => {
    component.form.markAllAsTouched();
    component.isSubmitted = true;
    component.form.updateValueAndValidity();

    expect(component.errorSummary.length).toBe(0);
  });

  it('should set date_to as required when date_from has a value in range mode', () => {
    component.dateInputType = 'range';

    component.form.controls.date_from.setValue('2023-09-01');

    expect(component.form.controls.date_to.hasError('required')).toBe(true);
  });

  it('should not set date_to as required when date_from is empty in range mode', () => {
    component.dateInputType = 'range';

    component.form.controls.date_from.setValue(null);

    expect(component.form.controls.date_to.hasError('required')).toBe(false);
  });

  it('should set date_from as required when date_to has a value in range mode', () => {
    component.dateInputType = 'range';

    component.form.controls.date_to.setValue('2023-09-10');

    expect(component.form.controls.date_from.hasError('required')).toBe(true);
  });

  it('should not set date_from as required when date_to is empty in range mode', () => {
    component.dateInputType = 'range';

    component.form.controls.date_to.setValue(null);

    expect(component.form.controls.date_from.hasError('required')).toBe(false);
  });

  it('should generate error summary correctly', () => {
    component.form.controls.courthouse.setErrors({ required: true });

    const errorSummary: ErrorSummaryEntry[] = component.generateErrorSummary();

    expect(errorSummary).toEqual([{ fieldId: 'courthouse', message: 'You must also enter a courthouse' }]);
  });

  it('should get field error messages correctly', () => {
    const fieldName = 'courthouse';

    component.form.controls[fieldName].setErrors({ required: true });

    const errorMessages: string[] = component.getFieldErrorMessages(fieldName);

    expect(errorMessages).toEqual(['You must also enter a courthouse']);
  });

  it('should handle courthouse selection correctly', () => {
    const courthouse = 'Test Courthouse';
    component.onCourthouseSelected(courthouse);

    const courthouseControl = component.form.get('courthouse');
    expect(courthouseControl?.value).toBe(courthouse);
    expect(courthouseControl?.dirty).toBe(true);
  });
});
