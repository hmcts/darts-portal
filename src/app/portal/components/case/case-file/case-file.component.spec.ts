import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Case } from '@portal-types/case/case.type';
import { UserService } from '@services/user/user.service';
import { CaseFileComponent } from './case-file.component';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';

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
    reportingRestrictions: [
      {
        hearing_id: 1,
        event_id: 1,
        event_name: 'Section 4(2) of the Contempt of Court Act 1981',
        event_text: '',
        event_ts: '2023-08-10T09:00:00Z',
      },
    ],
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
        DatePipe,
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

  describe('Retained Until date display', () => {
    function expectRetainedUntilDate(inputIso: string, expectedDate: string) {
      component.caseFile = {
        ...mockCaseFile,
        retainUntilDateTime: DateTime.fromISO(inputIso),
      };

      fixture.detectChanges();

      const headings = Array.from(fixture.nativeElement.querySelectorAll('h2.govuk-heading-s')) as HTMLElement[];
      const retainedUntilHeading = headings.find((h) => (h.textContent || '').trim() === 'Retained until');
      expect(retainedUntilHeading).toBeTruthy();

      const retainedUntilP = retainedUntilHeading!.nextElementSibling as HTMLElement | null;
      expect(retainedUntilP).toBeTruthy();

      const retainedText = retainedUntilP!.textContent?.trim() ?? '';
      expect(retainedText).toContain(expectedDate);
    }

    it('should display winter date correctly, i.e. +00:00', () => {
      expectRetainedUntilDate('2030-02-10T23:23:24.858Z', '10 Feb 2030');
    });

    it('should display summer BST date correctly, i.e. +01:00', () => {
      expectRetainedUntilDate('2030-08-10T23:23:24.858Z', '11 Aug 2030');
    });
  });
});
