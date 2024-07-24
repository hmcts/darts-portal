import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CourthouseData } from '@core-types/courthouse/courthouse.interface';
import { TabDirective } from '@directives/tab.directive';
import { AdminSearchService, defaultFormValues } from '@services/admin-search/admin-search.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { of } from 'rxjs';
import { AdminSearchFormValues } from './search-form/search-form.component';
import { SearchComponent } from './search.component';

const mockFormValues: AdminSearchFormValues = {
  caseId: '123',
  courtroom: '1',
  courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
  hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
  resultsFor: 'Cases',
};

const fakeCourthouseService = {
  getCourthouses: jest.fn().mockReturnValue(of([{ id: 1, display_name: 'Courthouse 1' }] as CourthouseData[])),
  mapCourthouseDataToCourthouses: jest.fn().mockReturnValue([{ id: 1, displayName: 'Courthouse 1' }] as Courthouse[]),
};

const fakeAdminSearchService = {
  getCases: jest.fn().mockReturnValue(of([])),
  getEvents: jest.fn().mockReturnValue(of([])),
  getHearings: jest.fn().mockReturnValue(of([])),
  getAudioMedia: jest.fn().mockReturnValue(of([])),
  formValues: signal({ ...defaultFormValues }),
  isLoading: signal(false),
  hasFormBeenSubmitted: signal(false),
  searchError: signal(null),
  cases: signal([]),
  events: signal([]),
  hearings: signal([]),
  audio: signal([]),
};

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: CourthouseService, useValue: fakeCourthouseService },
        { provide: AdminSearchService, useValue: fakeAdminSearchService },
        { provide: ScrollService, useValue: { scrollTo: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('courthouses$', () => {
    it('call getCourthouses', () => {
      expect(fakeCourthouseService.getCourthouses).toHaveBeenCalled();
    });

    it('set courthouses with mapped courthouse', () => {
      expect(component.courthouses()).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });

    it('call mapCourthouseDataToCourthouses', () => {
      expect(fakeCourthouseService.mapCourthouseDataToCourthouses).toHaveBeenCalledWith([
        { id: 1, display_name: 'Courthouse 1' },
      ]);
    });
  });

  describe('onSearch', () => {
    it('set flags', fakeAsync(() => {
      const isLoadingSpy = jest.spyOn(component.searchService.isLoading, 'set');
      const isSubmitedSpy = jest.spyOn(component.searchService.hasFormBeenSubmitted, 'set');
      const searchErrorSpy = jest.spyOn(component.searchService.searchError, 'set');
      const formValuesSpy = jest.spyOn(component.searchService.formValues, 'set');

      component.onSearch(mockFormValues);

      tick();

      expect(isLoadingSpy).toHaveBeenCalledWith(true);
      expect(isLoadingSpy).toHaveBeenCalledTimes(1);
      expect(isSubmitedSpy).toHaveBeenCalledWith(true);
      expect(searchErrorSpy).toHaveBeenCalledWith(null);
      expect(formValuesSpy).toHaveBeenCalledWith(mockFormValues);
    }));

    describe('case search', () => {
      it('call getCases with correct values', () => {
        component.onSearch(mockFormValues);
        expect(fakeAdminSearchService.getCases).toHaveBeenCalledWith(mockFormValues);
      });
    });

    describe('event search', () => {
      it('call getEvents with correct values', () => {
        component.onSearch({ ...defaultFormValues, resultsFor: 'Events' } as AdminSearchFormValues);
        expect(fakeAdminSearchService.getEvents).toHaveBeenCalledWith({ ...defaultFormValues, resultsFor: 'Events' });
      });
    });

    describe('hearing search', () => {
      it('call getHearings with correct values', () => {
        component.onSearch({ ...defaultFormValues, resultsFor: 'Hearings' } as AdminSearchFormValues);
        expect(fakeAdminSearchService.getHearings).toHaveBeenCalledWith({
          ...defaultFormValues,
          resultsFor: 'Hearings',
        });
      });
    });

    describe('audio search', () => {
      it('call getAudio with correct values', () => {
        component.onSearch({ ...defaultFormValues, resultsFor: 'Audio' } as AdminSearchFormValues);
        expect(fakeAdminSearchService.getAudioMedia).toHaveBeenCalledWith({
          ...defaultFormValues,
          resultsFor: 'Audio',
        });
      });
    });

    it('scrolls to search results', () => {
      const scrollToSpy = jest.spyOn(component.scrollService, 'scrollTo');
      component.onSearch({ ...defaultFormValues } as AdminSearchFormValues);
      expect(scrollToSpy).toHaveBeenCalledWith('#results');
    });
  });

  describe('onValidationErrors', () => {
    it('set formValidationErrors', () => {
      component.onValidationErrors([{ fieldId: 'error', message: 'error' }]);
      expect(component.formValidationErrors()).toEqual([{ fieldId: 'error', message: 'error' }]);
    });

    it('scrolls to validation errors', () => {
      const scrollToSpy = jest.spyOn(component.scrollService, 'scrollTo');
      component.onValidationErrors([{ fieldId: 'error', message: 'error' }]);
      expect(scrollToSpy).toHaveBeenCalledWith(component.validationSummarySelector);
    });
  });

  describe('tabChange', () => {
    it('updates formValues', () => {
      component.tabChange({ name: 'Cases' } as TabDirective);
      expect(component.searchService.formValues().resultsFor).toBe('Cases');
    });

    it('triggers search with last search form values', () => {
      const onSearchSpy = jest.spyOn(component, 'onSearch');
      component.searchService.formValues.set(mockFormValues);

      component.tabChange({ name: 'Hearings' } as TabDirective);

      expect(onSearchSpy).toHaveBeenCalledWith({
        ...mockFormValues,
        resultsFor: 'Hearings',
      });
    });
  });
});
