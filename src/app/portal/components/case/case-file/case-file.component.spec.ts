import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Case } from '@portal-types/case/case.type';
import { UserService } from 'src/app/core/services/user/user.service';
import { CaseFileComponent } from './case-file.component';

describe('CaseFileComponent', () => {
  let component: CaseFileComponent;
  let fixture: ComponentFixture<CaseFileComponent>;

  const mockCaseFile: Case = {
    id: 1,
    courthouse: 'Swansea',
    number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
    retainUntil: '2023-08-10T11:23:24.858Z',
  };
  const mockActivatedRoute = {
    snapshot: {
      params: {
        caseId: 1,
      },
    },
  };
  const fakeUserService = { isRequester: () => true, isTranscriber: () => false } as Partial<UserService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseFileComponent],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
    fixture = TestBed.createComponent(CaseFileComponent);
    component = fixture.componentInstance;
    component.caseFile = mockCaseFile;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
