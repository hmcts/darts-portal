import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourthouseData } from '@core-types/index';
import { CaseSearchFormValues } from '@portal-types/case';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { of } from 'rxjs';
import { CaseSearchService } from '../../services/case-search/case-search.service';
import { CaseSearchResultsComponent } from './case-search-results/case-search-results.component';
import { SearchComponent } from './search.component';

const mockCourthouses = [
  { courthouse_name: 'Reading', id: 0 },
  { courthouse_name: 'Slough', id: 1 },
  { courthouse_name: 'Ascot', id: 2 },
] as CourthouseData[];

const mockFormValues: CaseSearchFormValues = {
  caseNumber: '1',
  courthouse: 'Reading',
  courtroom: '2',
  judgeName: 'Judy',
  defendantName: 'Dave',
  hearingDate: {
    type: 'range',
    specific: '',
    from: '16/09/2022',
    to: '18/09/2022',
  },
  eventTextContains: 'Keywords',
};

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    const fakeCaseSearchService = {
      searchCases: jest.fn(),
      clearSearch: jest.fn(),
      results$: of(null),
      isAdvancedSearch: signal(false),
      isSubmitted: signal(false),
      isLoading: signal(false),
      getPreviousSearchFormValues: () => signal(null),
    } as unknown as CaseSearchService;

    const fakeCourtHouseService = {
      getCourthouses: jest.fn().mockReturnValue(of(mockCourthouses)),
    } as unknown as CourthouseService;

    const fakeErrorMsgService = {
      errorMessage$: of(null),
    } as unknown as ErrorMessageService;

    TestBed.configureTestingModule({
      imports: [SearchComponent, CaseSearchResultsComponent],
      providers: [
        { provide: CaseSearchService, useValue: fakeCaseSearchService },
        { provide: CourthouseService, useValue: fakeCourtHouseService },
        { provide: ErrorMessageService, useValue: fakeErrorMsgService },
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

  describe('#onSearch', () => {
    it('calls caseService searchCases with form data', () => {
      const searchCasesSpy = jest.spyOn(component.caseSearchService, 'searchCases');
      component.onSearch(mockFormValues);
      expect(searchCasesSpy).toHaveBeenCalledTimes(1);
      expect(searchCasesSpy).toHaveBeenCalledWith(mockFormValues);
    });

    it('scroll to results when search button is clicked and fields are filled correctly', () => {
      const scrollService = TestBed.inject(ScrollService);
      jest.spyOn(scrollService, 'scrollTo');
      component.onSearch(mockFormValues);
      expect(scrollService.scrollTo).toHaveBeenCalledWith('#results');
    });
  });

  describe('#onClear', () => {
    it('reset error summary ', () => {
      component.errorSummary.set([{ fieldId: 'courthouse', message: 'You must also enter a courthouse' }]);
      component.onClear();
      expect(component.errorSummary()).toEqual([]);
    });

    it('calls caseService clearSearch', () => {
      const clearSearchSpy = jest.spyOn(component.caseSearchService, 'clearSearch');
      component.onClear();
      expect(clearSearchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#onValidationError', () => {
    it('sets error summary', () => {
      const errorSummary = [{ fieldId: 'courthouse', message: 'You must also enter a courthouse' }];
      component.onValidationError(errorSummary);
      expect(component.errorSummary()).toEqual(errorSummary);
    });
  });
});
