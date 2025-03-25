import { AdminCase } from '@admin-types/case/case.type';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DateTime } from 'luxon';
import { CaseFileComponent } from './case-file.component';

describe('CaseFileComponent', () => {
  let component: CaseFileComponent;
  let fixture: ComponentFixture<CaseFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseFileComponent],
      providers: [provideRouter([])],
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

    it('should not render Judge/Defendant/Prosecutor rows when isDataAnonymised is true', () => {
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
});
