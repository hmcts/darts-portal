import { AdminCase } from '@admin-types/case/case.type';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DateTime } from 'luxon';
import { CaseFileComponent } from './case-file.component';
import { DatePipe } from '@angular/common';

describe('CaseFileComponent', () => {
  let component: CaseFileComponent;
  let fixture: ComponentFixture<CaseFileComponent>;

  const mockCaseFile: AdminCase = {
    id: 1,
    caseNumber: 'CASEGMTBST',
    courthouse: { id: 1001, displayName: 'SWANSEA' },
    isDataAnonymised: false,
    caseObjectId: '12345',
    caseStatus: 'OPEN',
    createdAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
    createdById: 5,
    lastModifiedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
    lastModifiedById: 5,
    isDeleted: false,
    caseDeletedById: 0,
    dataAnonymisedById: 0,
    isInterpreterUsed: false,
    reportingRestrictions: [],
    linkedCases: [
      {
        case_id: 21,
        case_number: 'C20220622021',
      },
      {
        case_id: 22,
        case_number: 'C20220622022',
      },
      {
        case_id: 23,
        case_number: 'C20220622023',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseFileComponent],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseFileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Conditional Rendering', () => {
    it('should show <app-reporting-restriction> and the retain link when isDataAnonymised is false', () => {
      const caseFile: AdminCase = {
        id: 1,
        caseNumber: 'CASE1001',
        courthouse: { id: 1001, displayName: 'SWANSEA' },
        isDataAnonymised: false,
        retainUntilDateTime: DateTime.fromISO('2030-01-31T15:42:10.361Z'),
        caseObjectId: '12345',
        caseStatus: 'OPEN',
        createdAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        createdById: 5,
        lastModifiedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        lastModifiedById: 5,
        isDeleted: false,
        caseDeletedById: 0,
        dataAnonymisedById: 0,
        isInterpreterUsed: false,
        reportingRestrictions: [],
      };

      fixture.componentRef.setInput('caseFile', caseFile);
      fixture.detectChanges();

      const restriction = fixture.debugElement.query(By.css('app-reporting-restriction'));
      expect(restriction).toBeTruthy();

      const retainLink = fixture.debugElement.query(By.css('dd[govuksummaryaction] a.govuk-link'));
      expect(retainLink).toBeTruthy();
      expect(retainLink.nativeElement.getAttribute('href')).toBe(`/case/${caseFile.id}/retention`);
    });

    it('should show <app-expired-banner> and not show retain link when isDataAnonymised is true', () => {
      const caseFile: AdminCase = {
        id: 2,
        caseNumber: 'CASE2002',
        courthouse: { id: 1002, displayName: 'READING' },
        isDataAnonymised: true,
        retainUntilDateTime: DateTime.fromISO('2031-05-01T00:00:00Z'),
        caseObjectId: 'ABC123',
        caseStatus: 'CLOSED',
        createdAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
        createdById: 5,
        lastModifiedAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
        lastModifiedById: 5,
        isDeleted: false,
        caseDeletedById: 0,
        dataAnonymisedById: 0,
        isInterpreterUsed: false,
      };

      fixture.componentRef.setInput('caseFile', caseFile);
      fixture.detectChanges();

      const expiredBanner = fixture.debugElement.query(By.css('app-expired-banner'));
      expect(expiredBanner).toBeTruthy();

      const restriction = fixture.debugElement.query(By.css('app-reporting-restriction'));
      expect(restriction).toBeFalsy();

      const retainLink = fixture.debugElement.query(By.css('dd[govuksummaryaction] a.govuk-link'));
      expect(retainLink).toBeFalsy();
    });

    it('should not render various rows such as Judge(s), Defendant(s) etc. when isDataAnonymised is true', () => {
      const caseFile: AdminCase = {
        id: 3,
        caseNumber: 'CASE3003',
        courthouse: { id: 1003, displayName: 'SLOUGH' },
        isDataAnonymised: true,
        retainUntilDateTime: DateTime.fromISO('2031-06-01T00:00:00Z'),
        caseObjectId: 'XYZ789',
        caseStatus: 'CLOSED',
        createdAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
        createdById: 5,
        lastModifiedAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
        lastModifiedById: 5,
        isDeleted: false,
        caseDeletedById: 0,
        dataAnonymisedById: 0,
        isInterpreterUsed: false,
        judges: ['Judge Judy'],
        defendants: ['Dave'],
        prosecutors: ['Prosecutor Jane'],
        defenders: ['Defender Dan'],
      };

      fixture.componentRef.setInput('caseFile', caseFile);
      fixture.detectChanges();

      const summaryKeys = fixture.debugElement.queryAll(By.css('.govuk-summary-list__key'));
      const labels = summaryKeys.map((el) => el.nativeElement.textContent.trim());

      const shouldBeHidden = ['Judge(s)', 'Defendant(s)', 'Prosecutor(s)', 'Defence', 'Retained until'];
      shouldBeHidden.forEach((label) => expect(labels).not.toContain(label));
    });
  });

  describe('Retained Until date display', () => {
    function expectRetainedUntilDate(inputIso: string, expectedDate: string) {
      fixture.componentRef.setInput('caseFile', {
        ...mockCaseFile,
        retainUntilDateTime: DateTime.fromISO(inputIso),
      });
      fixture.detectChanges();
      const row = fixture.debugElement
        .queryAll(By.css('.govuk-summary-list__row'))
        .find(
          (row) => row.query(By.css('.govuk-summary-list__key'))?.nativeElement?.textContent.trim() === 'Retained until'
        );

      expect(row).toBeTruthy();
      const valueElement = row?.query(By.css('.govuk-summary-list__value'))?.nativeElement;
      expect(valueElement.textContent.trim()).toBe(expectedDate);
    }

    it('should display winter date correctly, i.e. +00:00', () => {
      expectRetainedUntilDate('2030-02-10T23:23:24.858Z', '10 Feb 2030');
    });

    it('should display summer BST date correctly, i.e. +01:00', () => {
      expectRetainedUntilDate('2030-08-10T23:23:24.858Z', '11 Aug 2030');
    });
  });

  describe('Linked cases', () => {
    function getLinkedCasesValue(): HTMLElement {
      const row = fixture.debugElement
        .queryAll(By.css('.govuk-summary-list__row'))
        .find(
          (row) => row.query(By.css('.govuk-summary-list__key'))?.nativeElement.textContent.trim() === 'Linked case(s)'
        );

      expect(row).toBeTruthy();
      const value = row?.query(By.css('.govuk-summary-list__value'))?.nativeElement as HTMLElement | undefined;
      expect(value).toBeTruthy();

      return value!;
    }

    it.each([true, false])('should display all linked case numbers when isDataAnonymised is %s', (isDataAnonymised) => {
      fixture.componentRef.setInput('caseFile', {
        ...mockCaseFile,
        isDataAnonymised,
      });
      fixture.detectChanges();

      const list = getLinkedCasesValue();
      expect(list).toBeTruthy();
      const items = list!.querySelectorAll('li');

      expect(items.length).toBe(3);
      expect(items[0].textContent?.trim()).toBe('C20220622021');
      expect(items[1].textContent?.trim()).toBe('C20220622022');
      expect(items[2].textContent?.trim()).toBe('C20220622023');
    });

    it('should display all linked cases as hyperlinks', () => {
      fixture.componentRef.setInput('caseFile', mockCaseFile);
      fixture.detectChanges();

      const links = getLinkedCasesValue().querySelectorAll('a.govuk-link');

      expect(links.length).toBe(3);

      expect(links[0].textContent?.trim()).toBe('C20220622021');
      expect(links[0].getAttribute('href')).toBe('/admin/case/21');

      expect(links[1].textContent?.trim()).toBe('C20220622022');
      expect(links[1].getAttribute('href')).toBe('/admin/case/22');

      expect(links[2].textContent?.trim()).toBe('C20220622023');
      expect(links[2].getAttribute('href')).toBe('/admin/case/23');
    });

    it('should display a hyphen when there are no linked cases', () => {
      fixture.componentRef.setInput('caseFile', {
        ...mockCaseFile,
        linkedCases: [],
      });
      fixture.detectChanges();

      expect(getLinkedCasesValue().textContent?.trim()).toBe('-');
    });

    it('should display a hyphen when linked cases are undefined', () => {
      fixture.componentRef.setInput('caseFile', {
        ...mockCaseFile,
        linkedCases: undefined,
      });
      fixture.detectChanges();

      expect(getLinkedCasesValue().textContent?.trim()).toBe('-');
    });
  });
});
