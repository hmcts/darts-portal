import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseFile } from '@darts-types/index';
import { UserService } from '@services/user/user.service';
import { CaseRententionComponent } from './case-retention.component';

describe('CaseRetentionComponent', () => {
  let component: CaseRententionComponent;
  let fixture: ComponentFixture<CaseRententionComponent>;

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
      imports: [CaseRententionComponent],
      providers: [{ provide: UserService, useValue: fakeUserService }],
    });
    fixture = TestBed.createComponent(CaseRententionComponent);
    component = fixture.componentInstance;
    component.caseFile = mockCaseFile;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
