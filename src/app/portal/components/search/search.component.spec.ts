import { HttpClient, HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CourthouseComponent } from '@common/courthouse/courthouse.component';
import { CourthouseData, ErrorMessage, ErrorSummaryEntry } from '@core-types/index';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { CaseService } from '@services/case/case.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { of, throwError } from 'rxjs';
import { CaseSearchResultsComponent } from './case-search-results/case-search-results.component';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  const fakeAppInsightsService = {};
  const fakeAppConfigService = {};
  let httpClientSpy: HttpClient;
  let mockRouter: Router;
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let caseService: CaseService;
  let errorMsgService: ErrorMessageService;
  let headerService: HeaderService;
  let courthouseService: CourthouseService;
  const courts = [
    { courthouse_name: 'Reading', id: 0, created_date_time: 'mock' },
    { courthouse_name: 'Slough', id: 1, created_date_time: 'mock' },
    { courthouse_name: 'Ascot', id: 2, created_date_time: 'mock' },
  ] as CourthouseData[];

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as Router;

    headerService = new HeaderService();
    errorMsgService = new ErrorMessageService(headerService, mockRouter);
    caseService = new CaseService(httpClientSpy);
    courthouseService = new CourthouseService(httpClientSpy);
    jest.spyOn(caseService, 'searchCases').mockReturnValue(of([]));
    jest.spyOn(courthouseService, 'getCourthouses').mockReturnValue(of(courts));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, SearchComponent, CaseSearchResultsComponent, CourthouseComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AppConfigService, useValue: fakeAppConfigService },
        { provide: CaseService, useValue: caseService },
        { provide: CourthouseService, useValue: courthouseService },
        { provide: ErrorMessageService, useValue: errorMsgService },
        { provide: ScrollService, useValue: { scrollTo: jest.fn() } },
        provideHttpClient(),
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
      // With specific date picker, date_from and date_to should equal the same
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
      component.setInputValue('23/08/2023', 'date_to');

      expect(el.value).toEqual('23/08/2023');
      expect(component.form.controls['date_to'].value).toEqual('23/08/2023');
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
      const getCasesAdvancedSpy = jest.spyOn(caseService, 'searchCases');

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

    it('should set isAdvancedSearch true when search button is clicked and fields are filled incorrectly', () => {
      component.form.controls['case_number'].setValue('1');
      component.form.controls['courthouse'].setValue('Reading');
      component.form.controls['courtroom'].setValue('2');
      component.form.controls['judge_name'].setValue('Judy');
      component.form.controls['defendant_name'].setValue('Dave');
      // component.form.controls['specific_date'].setValue('');
      component.form.controls['date_to'].setValue('INVALID');
      component.form.controls['date_from'].setValue('INVALID');
      component.form.controls['event_text_contains'].setValue('Keywords');

      component.form.markAsDirty();
      component.form.markAsTouched();

      component.onSubmit();

      expect(component.isAdvancedSearch).toEqual(true);
    });

    it('scroll to top when search button is clicked and fields are filled incorrectly', () => {
      const scrollService = TestBed.inject(ScrollService);
      jest.spyOn(scrollService, 'scrollTo');

      component.form.controls['date_to'].setValue('INVALID');
      component.form.controls['date_from'].setValue('INVALID');

      component.onSubmit();

      expect(scrollService.scrollTo).toHaveBeenCalledWith('app-validation-error-summary');
    });

    it('scroll to results when search button is clicked and fields are filled correctly', () => {
      const scrollService = TestBed.inject(ScrollService);
      jest.spyOn(scrollService, 'scrollTo');

      component.form.controls['case_number'].setValue('1');

      component.form.markAllAsTouched();

      component.onSubmit();

      expect(scrollService.scrollTo).toHaveBeenCalledWith('#results');
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

      expect(courthouseComponentSpy).toHaveBeenCalled();
    });
  });

  it('error summary should contain no errors when form is valid and submitted', () => {
    component.form.markAllAsTouched();
    component.isSubmitted = true;
    component.form.updateValueAndValidity();

    expect(component.errorSummary.length).toBe(0);
  });

  it('should generate error summary when form is invalid and submitted', () => {
    // Simulate a form submission and set the form to be invalid
    component.isSubmitted = true;
    component.form.get('specific_date')?.setValue('bla');

    // Trigger the valueChanges subscription
    component.form.updateValueAndValidity();

    // Expect the errorSummary to be generated
    expect(component.errorSummary).toEqual(component.generateErrorSummary());
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

  it('should toggle advanced search flag', () => {
    expect(component.isAdvancedSearch).toBeFalsy();

    const event = new MouseEvent('click');

    component.toggleAdvancedSearch(event);

    expect(component.isAdvancedSearch).toBeTruthy();

    component.toggleAdvancedSearch(event);

    expect(component.isAdvancedSearch).toBeFalsy();
  });

  it('should handle errors and clear search form and results', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({ error: { type: 'CASE_100' }, status: 400, url: '/api/cases/search' });
    jest.spyOn(caseService, 'searchCases').mockReturnValue(throwError(() => errorResponse));

    component.form.markAsDirty();
    component.onSubmit();

    errorMsgService.handleErrorMessage(errorResponse);

    const errorMessageMock = { detail: { type: 'CASE_100' }, display: 'COMPONENT', status: 400 } as ErrorMessage;

    flush();

    let error: ErrorMessage | null = null;
    component.searchResults$?.subscribe();
    component.searchError$.subscribe((errorType) => {
      error = errorType;
    });

    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    expect(error).toEqual(errorMessageMock);
    expect(caseService.searchFormValues).toBeNull();
    expect(caseService.searchResults$).toBeNull();
  }));

  it('should restore form values when previousFormValues is defined and range was previously selected', () => {
    // Mock previousFormValues
    const previousFormValues = {
      case_number: '',
      courthouse: 'Cardiff',
      courtroom: '',
      date_from: '2022-09-01',
      date_to: '2022-09-30',
      defendant_name: '',
      event_text_contains: '',
      judge_name: '',
      specific_date: '',
    };

    caseService.searchFormValues = previousFormValues;

    component.restoreForm();

    expect(component.isAdvancedSearch).toBeTruthy();
    expect(component.dateInputType).toEqual('range');
    expect(component.courthouse).toEqual(previousFormValues.courthouse);
    expect(component.form.value).toEqual(previousFormValues);
    expect(component.form.dirty).toBeTruthy();
    expect(component.isSubmitted).toBeTruthy();
  });

  it('should restore form values when previousFormValues is defined and specific date was previously selected', () => {
    // Mock previousFormValues
    const previousFormValues = {
      case_number: '',
      courthouse: 'Cardiff',
      courtroom: '',
      date_from: '',
      date_to: '',
      defendant_name: '',
      event_text_contains: '',
      judge_name: '',
      specific_date: '2022-09-01',
    };

    caseService.searchFormValues = previousFormValues;

    component.restoreForm();

    expect(component.isAdvancedSearch).toBeTruthy();
    expect(component.dateInputType).toEqual('specific');
    expect(component.courthouse).toEqual(previousFormValues.courthouse);
    expect(component.form.value).toEqual(previousFormValues);
    expect(component.form.dirty).toBeTruthy();
    expect(component.isSubmitted).toBeTruthy();
  });
});
