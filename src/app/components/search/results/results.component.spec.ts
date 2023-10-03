import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { Case, Hearing } from '@darts-types/index';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

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
      const caseData = {} as Case;
      const hearing1 = { courtroom: '1', date: '2023-08-18' } as Hearing;
      const hearing2 = { courtroom: '2', date: '2023-08-19' } as Hearing;
      caseData.hearings = [hearing1, hearing2];
      jest.spyOn(component, 'getHearingsValue');

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('Multiple');
      expect(cValue).toBe('Multiple');
    });

    it('should return correct value if there is a single hearings for dates or courtrooms', () => {
      const caseData = {} as Case;
      const hearing1 = { courtroom: '1', date: '2023-08-18' } as Hearing;
      caseData.hearings = [hearing1];
      jest.spyOn(component, 'getHearingsValue');

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('Fri 18 Aug 2023');
      expect(cValue).toBe('1');
    });

    it('should return correct value if there is no hearings', () => {
      const caseData = {} as Case;
      jest.spyOn(component, 'getHearingsValue');

      const dValue = component.getHearingsValue(caseData, 'date');
      const cValue = component.getHearingsValue(caseData, 'courtroom');

      expect(component.getHearingsValue).toHaveBeenCalled();
      expect(dValue).toBe('');
      expect(cValue).toBe('');
    });
  });
});
