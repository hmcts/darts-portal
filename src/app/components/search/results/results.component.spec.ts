import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { CaseData } from '../../../types/case';
import { HearingData } from 'src/app/types/hearing';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
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
      spyOn(component, 'getNameValue').and.callThrough();
      const def = ['Defendant 1', 'Defendant 2'];
      const dValue = component.getNameValue(def);
      const judges = ['Judge 1', 'Judge 2'];
      const jValue = component.getNameValue(judges);

      expect(component.getNameValue).toHaveBeenCalled();
      expect(dValue).toBe('Multiple');
      expect(jValue).toBe('Multiple');
    });

    it('should return single name if there is a single defendant or judge', () => {
      spyOn(component, 'getNameValue').and.callThrough();
      const def = ['Defendant 1'];
      const dValue = component.getNameValue(def);
      const judges = ['Judge 1'];
      const jValue = component.getNameValue(judges);

      expect(component.getNameValue).toHaveBeenCalled();
      expect(dValue).toBe('Defendant 1');
      expect(jValue).toBe('Judge 1');
    });

    it('should return correct value if there is no defendants or judges', () => {
      spyOn(component, 'getNameValue').and.callThrough();

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
      spyOn(component, 'getHearingsValue').and.callThrough();

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
      spyOn(component, 'getHearingsValue').and.callThrough();

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('Fri 18 Aug 2023');
      expect(cValue).toBe('1');
    });

    it('should return correct value if there is no hearings', () => {
      const caseData = {} as CaseData;
      spyOn(component, 'getHearingsValue').and.callThrough();

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('');
      expect(cValue).toBe('');
    });
  });
});
