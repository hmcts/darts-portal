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

  describe('View or Change Link Visibility', () => {
    it('should hide the link when isDataAnonymised is true', () => {
      const caseFile: AdminCase = {
        id: 1,
        caseNumber: 'CASE1001',
        courthouse: { id: 1001, displayName: 'SWANSEA' },
        isDataAnonymised: true,
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
      };

      fixture.componentRef.setInput('caseFile', caseFile);
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css('.govuk-summary-action a'));

      expect(link).toBeFalsy();
    });

    it('should display the link when isDataAnonymised is false', () => {
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
      };

      fixture.componentRef.setInput('caseFile', caseFile);
      fixture.detectChanges();

      const retainedUntilRow = fixture.debugElement
        .queryAll(By.css('.govuk-summary-list__row'))
        .find(
          (row) => row.query(By.css('.govuk-summary-list__key'))?.nativeElement?.textContent.trim() === 'Retained until'
        );

      expect(retainedUntilRow).toBeTruthy();

      const actionCell = retainedUntilRow?.query(By.css('dd[govuksummaryaction]'));
      expect(actionCell).toBeTruthy();

      const actionLink = actionCell?.query(By.css('a.govuk-link'));
      expect(actionLink).toBeTruthy();
      expect(actionLink?.nativeElement.getAttribute('href')).toBe(`/case/1/retention`);
    });
  });
});
