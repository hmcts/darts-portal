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
    linkedCases: [
      {
        case_id: 21,
        case_number: 'C20220622021',
        active_link: true,
      },
      {
        case_id: 22,
        case_number: 'C20220622022',
        active_link: false,
      },
      {
        case_id: 23,
        case_number: 'C20220622023',
        active_link: true,
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

  describe('Linked cases', () => {
    function getLinkedCasesList(): HTMLElement | null {
      const headings = Array.from(fixture.nativeElement.querySelectorAll('h2.govuk-heading-s')) as HTMLElement[];
      const linkedCasesHeading = headings.find((h) => (h.textContent || '').trim() === 'Linked case(s)');

      expect(linkedCasesHeading).toBeTruthy();
      return linkedCasesHeading!.nextElementSibling as HTMLElement | null;
    }

    it.each([true, false])('should display all linked case numbers when isDataAnonymised is %s', (isDataAnonymised) => {
      component.caseFile = {
        ...mockCaseFile,
        isDataAnonymised,
      };

      fixture.detectChanges();

      const list = getLinkedCasesList();
      expect(list).toBeTruthy();
      const items = list!.querySelectorAll('li');

      expect(items.length).toBe(3);
      expect(items[0].textContent?.trim()).toBe('C20220622021');
      expect(items[1].textContent?.trim()).toBe('C20220622022');
      expect(items[2].textContent?.trim()).toBe('C20220622023');
    });

    it('should display active linked cases as hyperlinks', () => {
      const list = getLinkedCasesList();
      const links = list!.querySelectorAll('a.govuk-link');

      expect(links.length).toBe(2);

      expect(links[0].textContent?.trim()).toBe('C20220622021');
      expect(links[0].getAttribute('href')).toBe('/case/21');

      expect(links[1].textContent?.trim()).toBe('C20220622023');
      expect(links[1].getAttribute('href')).toBe('/case/23');
    });

    it('should display inactive linked cases as plain text', () => {
      const list = getLinkedCasesList();
      const items = list!.querySelectorAll('li');

      expect(items[1].textContent?.trim()).toBe('C20220622022');
      expect(items[1].querySelector('a')).toBeNull();
    });

    it('should not display linked cases when the array is empty', () => {
      component.caseFile = {
        ...mockCaseFile,
        linkedCases: [],
      };

      fixture.detectChanges();

      const headings = Array.from(fixture.nativeElement.querySelectorAll('h2.govuk-heading-s')) as HTMLElement[];
      const linkedCasesHeading = headings.find((h) => (h.textContent || '').trim() === 'Linked case(s)');
      expect(linkedCasesHeading).toBeUndefined();
    });

    it('should not display linked cases when the array is undefined', () => {
      component.caseFile = {
        ...mockCaseFile,
        linkedCases: undefined,
      };

      fixture.detectChanges();

      const headings = Array.from(fixture.nativeElement.querySelectorAll('h2.govuk-heading-s')) as HTMLElement[];
      const linkedCasesHeading = headings.find((h) => (h.textContent || '').trim() === 'Linked case(s)');
      expect(linkedCasesHeading).toBeUndefined();
    });
  });
});
