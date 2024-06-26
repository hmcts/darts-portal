import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CourthouseData } from '@core-types/courthouse/courthouse.interface';
import { TabDirective } from '@directives/tab.directive';
import { AdminSearchService } from '@services/admin-search/admin-search.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { of, throwError } from 'rxjs';
import { SearchComponent } from './search.component';

const fakeCourthouseService = {
  getCourthouses: jest.fn().mockReturnValue(of([{ id: 1, display_name: 'Courthouse 1' }] as CourthouseData[])),
  mapCourthouseDataToCourthouses: jest.fn().mockReturnValue([{ id: 1, displayName: 'Courthouse 1' }] as Courthouse[]),
};

const fakeAdminSearchService = {
  getCases: jest.fn().mockReturnValue(of([])),
  getEvents: jest.fn().mockReturnValue(of([])),
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
      const isLoadingSpy = jest.spyOn(component.isLoading, 'set');
      const isSubmitedSpy = jest.spyOn(component.isSubmitted, 'set');
      const searchErrorSpy = jest.spyOn(component.searchError, 'set');
      const tabSpy = jest.spyOn(component.tab, 'set');

      component.onSearch({
        caseId: '123',
        courtroom: '1',
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
        hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
        resultsFor: 'Cases',
      });

      tick();

      expect(isLoadingSpy).toHaveBeenCalledWith(true);
      expect(isLoadingSpy).toHaveBeenCalledTimes(2);
      expect(isSubmitedSpy).toHaveBeenCalledWith(true);
      expect(searchErrorSpy).toHaveBeenCalledWith(null);
      expect(tabSpy).toHaveBeenCalledWith('Cases');
    }));

    describe('case search', () => {
      it('call getCases with correct values', () => {
        component.onSearch({
          caseId: '123',
          courtroom: '1',
          courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
          hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
          resultsFor: 'Cases',
        });
        expect(fakeAdminSearchService.getCases).toHaveBeenCalledWith({
          caseId: '123',
          courtroom: '1',
          courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
          hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
          resultsFor: 'Cases',
        });
      });

      it('errors', fakeAsync(() => {
        jest.spyOn(fakeAdminSearchService, 'getCases').mockReturnValue(throwError(() => 'error'));
        const handleErrorSpy = jest.spyOn(component, 'handleError');

        component.onSearch({
          caseId: '123',
          courtroom: '1',
          courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
          hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
          resultsFor: 'Cases',
        });

        tick();

        expect(handleErrorSpy).toHaveBeenCalled();
        expect(component.isLoading()).toBe(false);
        expect(component.cases()).toEqual([]);
        expect(component.searchError()).toBe('There are more than 500 results. Refine your search.');
      }));
    });

    describe('event search', () => {
      it('call getEvents with correct values', () => {
        component.onSearch({
          caseId: '123',
          courtroom: '1',
          courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
          hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
          resultsFor: 'Events',
        });
        expect(fakeAdminSearchService.getEvents).toHaveBeenCalledWith({
          caseId: '123',
          courtroom: '1',
          courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
          hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
          resultsFor: 'Events',
        });
      });
    });

    describe('tabChange', () => {
      it('set tab', () => {
        component.tabChange({ name: 'Cases' } as TabDirective);
        expect(component.tab()).toBe('Cases');
      });

      it('triggers search with last search form values', () => {
        const onSearchSpy = jest.spyOn(component, 'onSearch');
        component.lastSearchFormValues.set({
          caseId: '123',
          courtroom: '1',
          courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
          hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
          resultsFor: 'Cases',
        });

        component.tabChange({ name: 'Hearings' } as TabDirective);

        expect(onSearchSpy).toHaveBeenCalledWith({
          caseId: '123',
          courtroom: '1',
          courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
          hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
          resultsFor: 'Hearings',
        });
      });
    });
  });
});
