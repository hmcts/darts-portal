import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { CaseData } from '../../../types/case';
import { HearingData } from 'src/app/types/hearing';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  const MOCK_CASES: CaseData[] = [
    {
      case_id: 1,
      case_number: 'C20220620001',
      courthouse: 'Swansea',
      defendants: ['Defendant Dave'],
      judges: ['Judge Judy'],
      reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
      hearings: [
        {
          id: 1,
          date: '2023-08-10',
          courtroom: '1',
          judges: ['Judge Judy'],
        },
      ],
    },
    {
      case_id: 2,
      case_number: 'C20220620002',
      courthouse: 'Slough',
      defendants: ['Defendant Derren'],
      judges: ['Judge Juniper'],
      hearings: [],
    },
    {
      case_id: 3,
      case_number: 'C20220620003',
      courthouse: 'Reading',
      defendants: ['Defendant Darran', 'Defendant Daniel'],
      judges: ['Judge Julie'],
      reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
      hearings: [
        {
          id: 1,
          date: '2023-08-10',
          courtroom: '3',
          judges: ['Judge Judy'],
        },
      ],
    },
    {
      case_id: 4,
      case_number: 'C20220620004',
      courthouse: 'Windsor',
      defendants: ['Defendant Dileep', 'Defendant Debs'],
      judges: ['Judge Josephine', 'Judge Jackie'],
      hearings: [
        {
          id: 1,
          date: '2023-08-10',
          courtroom: '3',
          judges: ['Judge Judy'],
        },
        {
          id: 2,
          date: '2033-09-10',
          courtroom: '5',
          judges: ['Judge Judy'],
        },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResultsComponent],
    });
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getNameValue', () => {
    it('should return Multiple if there are multiple defendants or judge', () => {
      jest.spyOn(component, 'getNameValue');
      const def = ['Defendant 1', 'Defendant 2'];
      const dValue = component.getNameValue(def);
      const judges = ['Judge 1', 'Judge 2'];
      const jValue = component.getNameValue(judges);

      expect(component.getNameValue).toHaveBeenCalled();
      expect(dValue).toBe('Multiple');
      expect(jValue).toBe('Multiple');
    });

    it('should return single name if there is a single defendant or judge', () => {
      jest.spyOn(component, 'getNameValue');
      const def = ['Defendant 1'];
      const dValue = component.getNameValue(def);
      const judges = ['Judge 1'];
      const jValue = component.getNameValue(judges);

      expect(component.getNameValue).toHaveBeenCalled();
      expect(dValue).toBe('Defendant 1');
      expect(jValue).toBe('Judge 1');
    });

    it('should return correct value if there is no defendants or judges', () => {
      jest.spyOn(component, 'getNameValue');

      const eValue = component.getNameValue([]);
      const emValue = component.getNameValue([]);

      expect(component.getNameValue).toHaveBeenCalled();
      expect(eValue).toBe('');
      expect(emValue).toBe('');
    });
  });

  describe('#getHearingsValue', () => {
    it('should return Multiple if there are multiple hearings for dates or courtrooms', () => {
      const caseData = {} as CaseData;
      const hearing1 = { courtroom: '1', date: '2023-08-18' } as HearingData;
      const hearing2 = { courtroom: '2', date: '2023-08-19' } as HearingData;
      caseData.hearings = [hearing1, hearing2];
      jest.spyOn(component, 'getHearingsValue');

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('Multiple');
      expect(cValue).toBe('Multiple');
    });

    it('should return correct value if there is a single hearings for dates or courtrooms', () => {
      const caseData = {} as CaseData;
      const hearing1 = { courtroom: '1', date: '2023-08-18' } as HearingData;
      caseData.hearings = [hearing1];
      jest.spyOn(component, 'getHearingsValue');

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('Fri 18 Aug 2023');
      expect(cValue).toBe('1');
    });

    it('should return correct value if there is no hearings', () => {
      const caseData = {} as CaseData;
      jest.spyOn(component, 'getHearingsValue');

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('');
      expect(cValue).toBe('');
    });
  });

  describe('Pagination', () => {
    it('pages cases based on page limit', () => {
      component.cases = MOCK_CASES;
      component.currentPage = 1;
      component.pageLimit = 1;

      component.ngOnChanges();

      expect(component.pagedCases.length).toEqual(1);
    });

    it('pages cases based on current page', () => {
      // Given 4 cases and a page limit of 3 and on page 2
      component.cases = MOCK_CASES;
      component.pageLimit = 3;

      component.onPageChanged(2);

      expect(component.pagedCases.length).toEqual(1);
      expect(component.pagedCases[0]).toEqual(MOCK_CASES[3]);
    });
  });
});
