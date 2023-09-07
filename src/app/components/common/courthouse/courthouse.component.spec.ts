import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CourthouseData } from 'src/app/types/courthouse';

import { CourthouseComponent } from './courthouse.component';
import { CaseService } from 'src/app/services/case/case.service';
import { AppInsightsService } from 'src/app/services/app-insights/app-insights.service';
import { of, throwError } from 'rxjs';

describe('CourthouseComponent', () => {
  const fakeAppInsightsService = {};
  let httpClientSpy: HttpClient;
  let component: CourthouseComponent;
  let fixture: ComponentFixture<CourthouseComponent>;

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
    // stub getCourthouses as it runs on init
    jest.spyOn(caseService, 'getCourthouses').mockReturnValue(of(courts));

    TestBed.configureTestingModule({
      imports: [CourthouseComponent, HttpClientModule],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: CaseService, useValue: caseService },
      ],
    });
    fixture = TestBed.createComponent(CourthouseComponent);
    component = fixture.componentInstance;
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

  describe('#getCourthouses', () => {
    it('loads courthouses and sets autocomplete element', () => {
      const getCourthousesSpy = jest.spyOn(component, 'getCourthouses');
      component.ngOnInit();

      expect(component.props.element).toBeTruthy();
      expect(component.props.source).toBeTruthy();
      expect(component.courthouses).toEqual(courts);

      expect(getCourthousesSpy).toHaveBeenCalled();
    });

    it('handles error response', () => {
      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.`, type: 'type' },
        status: 404,
        statusText: 'Not Found',
      });

      caseService.getCourthouses = jest.fn().mockReturnValue(throwError(() => errorResponse));
      component.getCourthouses();

      expect(component.loadError).toBeTruthy();
      expect(component.loaded).toBeTruthy();
    });
  });
});
