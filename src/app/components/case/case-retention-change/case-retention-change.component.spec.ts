import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseFile } from '@darts-types/index';
import { UserService } from '@services/user/user.service';
import { CaseRententionChangeComponent } from './case-retention-change.component';

describe('CaseRetentionComponent', () => {
  let component: CaseRententionChangeComponent;
  let fixture: ComponentFixture<CaseRententionChangeComponent>;

  const mockCaseFile: CaseFile = {
    case_id: 1,
    courthouse: 'Swansea',
    case_number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    retain_until: '2023-08-10T11:23:24.858Z',
  };

  const fakeUserService = { isRequester: () => true, isTranscriber: () => false } as Partial<UserService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseRententionChangeComponent],
      providers: [{ provide: UserService, useValue: fakeUserService }],
    });
    fixture = TestBed.createComponent(CaseRententionChangeComponent);
    component = fixture.componentInstance;
    component.caseFile = mockCaseFile;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
