import { AdminCase } from '@admin-types/case/case.type';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DateTime } from 'luxon';
import { CaseAdditionalDetailsComponent } from './case-additional-details.component';
import { DatePipe } from '@angular/common';

describe('CaseAdditionalDetailsComponent', () => {
  let component: CaseAdditionalDetailsComponent;
  let fixture: ComponentFixture<CaseAdditionalDetailsComponent>;

  const caseFile: AdminCase = {
    id: 1,
    caseObjectId: '12345',
    caseObjectName: 'NAME',
    caseType: 'Type A',
    uploadPriority: 0,
    caseStatus: 'OPEN',
    caseClosedDateTime: DateTime.fromISO('2023-07-20T00:00:00Z'),
    isInterpreterUsed: false,
    isRetentionUpdated: true,
    retentionRetries: 0,
    isDataAnonymised: true,
    dataAnonymisedBy: 'Phil Taylor',
    dataAnonymisedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
    retConfScore: 123,
    retConfReason: 'Some reason',
    retConfUpdatedTs: DateTime.fromISO('2024-01-01T00:00:00Z'),
    isDeleted: true,
    caseDeletedBy: 'Trina Gulliver',
    caseDeletedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
    createdAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
    createdBy: 'Michael van Gerwen',
    lastModifiedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
    lastModifiedBy: 'Fallon Sherrock',
    caseNumber: '',
    courthouse: {
      id: 0,
      displayName: '',
    },
    createdById: 0,
    lastModifiedById: 0,
    caseDeletedById: 0,
    dataAnonymisedById: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseAdditionalDetailsComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseAdditionalDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Case Details Display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('caseFile', caseFile);
      fixture.detectChanges();
    });

    it('should display the correct case details', () => {
      const expectedData = [
        ['Database ID', '1'],
        ['Case object ID', '12345'],
        ['Case object name', 'NAME'],
        ['Case type', 'Type A'],
        ['Upload priority', '0'],
        ['Case closed?', 'No'],
        ['Date case closed', '20/07/2023'],
        ['Interpreter used?', 'No'],
        ['Retention updated?', 'Yes'],
        ['Retention retries?', '0'],
        ['Case anonymised?', 'Yes'],
        ['Case anonymised by', 'Phil Taylor'],
        ['Date anonymised', '01/01/2024'],
        ['Retention confidence score', '123'],
        ['Retention confidence reason', 'Some reason'],
        ['Retention confidence date updated', '01/01/2024'],
        ['Case deleted?', 'Yes'],
        ['Case deleted by', 'Trina Gulliver'],
        ['Date deleted', '01/01/2024'],
        ['Date created', '01/01/2024'],
        ['Created by', 'Michael van Gerwen'],
        ['Date last modified', '01/01/2024'],
        ['Last modified by', 'Fallon Sherrock'],
      ];

      expectedData.forEach(([key, value]) => {
        const row = fixture.debugElement
          .queryAll(By.css('.govuk-summary-list__row'))
          .find((row) => row.query(By.css('.govuk-summary-list__key'))?.nativeElement?.textContent.trim() === key);

        expect(row).toBeTruthy();
        const valueElement = row?.query(By.css('.govuk-summary-list__value'))?.nativeElement;
        expect(valueElement.textContent.trim()).toBe(value);
      });
    });
  });

  describe('Default Values for Missing Data', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('caseFile', {} as AdminCase); // Empty object to test default values
      fixture.detectChanges();
    });

    it('should display "-" for missing values', () => {
      const expectedKeys = [
        'Database ID',
        'Case object ID',
        'Case object name',
        'Case type',
        'Upload priority',
        'Date case closed',
        'Retention retries?',
        'Case anonymised by',
        'Date anonymised',
        'Retention confidence score',
        'Retention confidence reason',
        'Retention confidence date updated',
        'Case deleted by',
        'Date deleted',
        'Date created',
        'Date last modified',
      ];

      expectedKeys.forEach((key) => {
        const row = fixture.debugElement
          .queryAll(By.css('.govuk-summary-list__row'))
          .find((row) => row.query(By.css('.govuk-summary-list__key'))?.nativeElement?.textContent.trim() === key);

        expect(row).toBeTruthy();
        const valueElement = row?.query(By.css('.govuk-summary-list__value'))?.nativeElement;
        expect(valueElement.textContent.trim()).toBe('-');
      });
    });

    it('should display "No" for boolean values that are false', () => {
      const booleanKeys = [
        'Case closed?',
        'Interpreter used?',
        'Retention updated?',
        'Case anonymised?',
        'Case deleted?',
      ];

      booleanKeys.forEach((key) => {
        const row = fixture.debugElement
          .queryAll(By.css('.govuk-summary-list__row'))
          .find((row) => row.query(By.css('.govuk-summary-list__key'))?.nativeElement?.textContent.trim() === key);

        expect(row).toBeTruthy();
        const valueElement = row?.query(By.css('.govuk-summary-list__value'))?.nativeElement;
        expect(valueElement.textContent.trim()).toBe('No');
      });
    });
  });

  describe('Display of dates', () => {
    function expectDateDisplay(inputDate: DateTime, expectedDate: string) {
      fixture.componentRef.setInput('caseFile', {
        ...caseFile,
        caseClosedDateTime: inputDate,
        dataAnonymisedAt: inputDate,
        retConfUpdatedTs: inputDate,
        caseDeletedAt: inputDate,
        createdAt: inputDate,
        lastModifiedAt: inputDate
      }
      );
      fixture.detectChanges();

      const expectedData = [
        ['Date case closed', expectedDate],
        ['Date anonymised', expectedDate],
        ['Retention confidence date updated', expectedDate],
        ['Date deleted', expectedDate],
        ['Date created', expectedDate],
        ['Date last modified', expectedDate],
      ];

      expectedData.forEach(([key, value]) => {
        const row = fixture.debugElement
          .queryAll(By.css('.govuk-summary-list__row'))
          .find((row) => row.query(By.css('.govuk-summary-list__key'))?.nativeElement?.textContent.trim() === key);

        expect(row).toBeTruthy();
        const valueElement = row?.query(By.css('.govuk-summary-list__value'))?.nativeElement;
        expect(valueElement.textContent.trim()).toBe(value);
      });
    }
    
    it('should display winter date correctly, i.e. +00:00', () => {
      expectDateDisplay(
        DateTime.fromISO('2030-02-10T23:23:24.858Z'),
        '10/02/2030'
      );
    });

    it('should display summer BST date correctly, i.e. +01:00', () => {
      expectDateDisplay(
        DateTime.fromISO('2030-08-10T23:23:24.858Z'),
        '11/08/2030'
      );
    });
  });
});
