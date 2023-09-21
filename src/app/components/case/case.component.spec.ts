import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Case, Hearing } from '@darts-types/index';
import { CaseService } from '@services/case/case.service';
import { Observable, of } from 'rxjs';
import { CaseComponent } from './case.component';

describe('CaseComponent', () => {
  let component: CaseComponent;
  let fixture: ComponentFixture<CaseComponent>;

  const mockCaseFile: Observable<Case> = of({
    case_id: 1,
    courthouse: 'Swansea',
    case_number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    retain_until: '2023-08-10T11:23:24.858Z',
  });

  const mockSingleCaseTwoHearings: Observable<Hearing[]> = of([
    {
      id: 1,
      date: '2023-09-01',
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcript_count: 1,
    },
  ]);

  const caseServiceMock = {
    getCase: jest.fn(),
    getCaseHearings: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      params: {
        caseId: 1,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CaseService, useValue: caseServiceMock },
      ],
    });

    jest.spyOn(caseServiceMock, 'getCase').mockReturnValue(mockCaseFile);
    jest.spyOn(caseServiceMock, 'getCaseHearings').mockReturnValue(mockSingleCaseTwoHearings);

    fixture = TestBed.createComponent(CaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('caseId should be set', () => {
    expect(component.caseId).toEqual(1);
  });

  it('caseFile$ should be set', () => {
    expect(component.caseFile$).toEqual(mockCaseFile);
  });

  it('hearings$ should be set', () => {
    expect(component.hearings$).toEqual(mockSingleCaseTwoHearings);
  });
});
