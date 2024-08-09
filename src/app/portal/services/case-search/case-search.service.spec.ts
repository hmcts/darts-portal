import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CaseSearchFormValues, CaseSearchResult } from '@portal-types/case';
import { CaseService } from '@services/case/case.service';
import { of, throwError } from 'rxjs';
import { CaseSearchService } from './case-search.service';

const mockFormValues: CaseSearchFormValues = {
  caseNumber: '',
  courthouse: '',
  courtroom: '',
  hearingDate: {
    from: '',
    specific: '',
    to: '',
    type: '',
  },
  judgeName: '',
  defendantName: '',
  eventTextContains: '',
};

const mockCaseSearchResults: CaseSearchResult[] = [
  {
    id: 1,
    number: 'number',
  },
];

describe('CaseSearchService', () => {
  let service: CaseSearchService;
  let caseService: CaseService;

  beforeEach(() => {
    const fakeCaseService = {
      searchCases: jest.fn().mockReturnValue(of(mockCaseSearchResults)),
    } as unknown as CaseSearchService;

    TestBed.configureTestingModule({
      providers: [CaseSearchService, { provide: CaseService, useValue: fakeCaseService }],
    });

    service = TestBed.inject(CaseSearchService);
    caseService = TestBed.inject(CaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('results$', () => {
    it('should return null on initial subscription', fakeAsync(() => {
      service.results$.subscribe((res) => {
        expect(res).toBeNull();
      });
      tick();
    }));

    it('should return results from search$', fakeAsync(() => {
      service['search$'].next(mockFormValues);

      service.results$.subscribe((res) => {
        expect(res).toEqual(mockCaseSearchResults);
      });

      tick();
    }));

    it('should return null if search$ emits null', fakeAsync(() => {
      service['search$'].next(null);

      service.results$.subscribe((res) => {
        expect(res).toBeNull();
      });

      tick();
    }));

    it('replays last search results', fakeAsync(() => {
      const searchCasesSpy = jest.spyOn(caseService, 'searchCases');

      service['search$'].next(mockFormValues);

      service.results$.subscribe();
      service.results$.subscribe();
      service.results$.subscribe();

      tick();
      expect(searchCasesSpy).toHaveBeenCalledTimes(1);
    }));

    it('calls errorMsgService.updateDisplayType when searchCases fails and return null', fakeAsync(() => {
      const updateDisplayTypeSpy = jest.spyOn(service.errorMsgService, 'updateDisplayType');
      jest.spyOn(caseService, 'searchCases').mockReturnValue(throwError(() => new Error()));

      service.results$.subscribe((result) => expect(result).toBeNull());
      service['search$'].next(mockFormValues);
      tick();
      expect(updateDisplayTypeSpy).toHaveBeenCalledWith('COMPONENT');
    }));
  });

  describe('#searchCases', () => {
    it('should clear any existing error messages', () => {
      const clearErrorMessageSpy = jest.spyOn(service.errorMsgService, 'clearErrorMessage');
      service.searchCases(mockFormValues);
      expect(clearErrorMessageSpy).toHaveBeenCalled();
    });

    it('save form values to previousSearchFormValues', () => {
      service.searchCases(mockFormValues);
      expect(service.getPreviousSearchFormValues()()).toEqual(mockFormValues);
    });

    it('call searchCases in CaseService with form values', fakeAsync(() => {
      const searchCasesSpy = jest.spyOn(caseService, 'searchCases');
      service.results$.subscribe();
      service.searchCases(mockFormValues);
      tick();
      expect(searchCasesSpy).toHaveBeenCalledWith(mockFormValues);
    }));
  });

  describe('#clearSearch', () => {
    it('should clear any existing error messages', () => {
      const clearErrorMessageSpy = jest.spyOn(service.errorMsgService, 'clearErrorMessage');
      service.clearSearch();
      expect(clearErrorMessageSpy).toHaveBeenCalled();
    });

    it('clear previousSearchFormValues', () => {
      service.searchCases(mockFormValues);
      service.clearSearch();
      expect(service.getPreviousSearchFormValues()()).toBeNull();
    });

    it('call search$ with null to clear search', fakeAsync(() => {
      const searchSubjectSpy = jest.spyOn(service['search$'], 'next');
      service.results$.subscribe();
      service.clearSearch();
      tick();
      expect(searchSubjectSpy).toHaveBeenCalledWith(null);
    }));
  });
});
