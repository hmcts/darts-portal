import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { CaseRetentionHistory } from '@darts-types/case-retention-history.interface';
import { Case } from '@darts-types/case.interface';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { CaseRetentionDateComponent } from './case-retention-date.component';

describe('CaseRetentionDateComponent', () => {
  let component: CaseRetentionDateComponent;
  let fixture: ComponentFixture<CaseRetentionDateComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        caseId: 1,
      },
    },
  };

  const fakeHeaderService = {
    showNavigation: jest.fn(),
    hideNavigation: jest.fn(),
  };

  const mockRetentionHistory: CaseRetentionHistory[] = [
    {
      retention_last_changed_date: '2023-01-01T00:00:00Z',
      retention_date: '2030-09-15',
      amended_by: 'Judge Phil',
      retention_policy_applied: 'Permanent',
      comments: 'Permanent policy applied',
      status: 'COMPLETE',
    },
    {
      retention_last_changed_date: '2023-01-03T00:00:00Z',
      retention_date: '2030-09-15',
      amended_by: 'Judge Phil',
      retention_policy_applied: 'Permanent',
      comments: 'Permanent policy applied',
      status: 'PENDING',
    },
    {
      retention_last_changed_date: '2023-01-02T00:00:00Z',
      retention_date: '2030-09-15',
      amended_by: 'Judge Phil',
      retention_policy_applied: 'Permanent',
      comments: 'Permanent policy applied',
      status: 'PENDING',
    },
  ];

  const mockCaseData: Case = {
    id: 1,
    courthouse: 'Swansea',
    number: 'C20220620001',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    retainUntilDateTime: DateTime.fromISO('2030-08-10T11:23:24.858Z'),
    closedDateTime: DateTime.fromISO('2023-08-15T14:57:24.858Z'),
    retentionDateTimeApplied: DateTime.fromISO('2023-12-12T11:02:24.858Z'),
    retentionPolicyApplied: 'Manual',
  };

  const mockCaseService = {
    getCase: jest.fn().mockReturnValue(of(mockCaseData)),
    getCaseRetentionHistory: jest.fn().mockReturnValue(of(mockRetentionHistory)),
  } as unknown as CaseService;
  const mockDatePipe = new DatePipe('en-GB');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRetentionDateComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DatePipe },
        { provide: CaseService, useValue: mockCaseService },
        { provide: HeaderService, useValue: fakeHeaderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseRetentionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getLatestDate', () => {
    const result = component.getLatestDate(mockRetentionHistory);
    expect(result).toEqual(mockRetentionHistory[1]);
  });

  it('#getEarliestDate', () => {
    const result = component.getEarliestDate(mockRetentionHistory);
    expect(result).toEqual(mockRetentionHistory[0]);
  });

  it('#getOriginalRetentionDateString', () => {
    const result = component.getOriginalRetentionDateString(mockRetentionHistory);
    const expectedDateString = mockDatePipe.transform(mockRetentionHistory[0].retention_date, 'dd/MM/yyyy');
    expect(result).toEqual(expectedDateString);
  });

  describe('#infoBannerHide', () => {
    it('should return false if rows array is empty', () => {
      expect(component.infoBannerHide([])).toBe(false);
    });

    it('should return true if the latest date status is not PENDING', () => {
      jest.spyOn(component, 'getLatestDate').mockReturnValue(mockRetentionHistory[0]);
      expect(component.infoBannerHide(mockRetentionHistory)).toBe(true);
    });

    it('should return false if the latest date status is PENDING', () => {
      jest.spyOn(component, 'getLatestDate').mockReturnValue(mockRetentionHistory[1]);
      expect(component.infoBannerHide(mockRetentionHistory)).toBe(false);
    });
  });

  describe('#buttonGroupHide', () => {
    it('should return true if rows array is empty', () => {
      expect(component.buttonGroupHide([])).toBe(true);
    });

    it('should return true if the latest date status is not COMPLETE', () => {
      const mockLatestDate = mockRetentionHistory[2];
      expect(mockLatestDate.status).not.toBe('COMPLETE');

      jest.spyOn(component, 'getLatestDate').mockReturnValue(mockLatestDate);

      const result = component.buttonGroupHide(mockRetentionHistory);
      expect(result).toBe(true);
    });

    it('should return false if the latest date status is COMPLETE', () => {
      jest.spyOn(component, 'getLatestDate').mockReturnValue(mockRetentionHistory[0]);
      expect(component.buttonGroupHide(mockRetentionHistory)).toBe(false);
    });
  });

  describe('#changeRetentionDate', () => {
    it('should return true if rows array is empty', () => {
      component.changeRetentionDate();
      expect(component.state).toEqual('Change');
    });
  });

  describe('#onStateChanged', () => {
    it('should change state value to "Change"', () => {
      const testValue = 'Change';
      component.onStateChanged(testValue);
      expect(component.state).toEqual(testValue);
      expect(fakeHeaderService.hideNavigation).toHaveBeenCalled();
    });

    it('should change state value to "Success"', () => {
      const testValue = 'Success';
      component.onStateChanged(testValue);
      expect(component.state).toEqual(testValue);
      expect(mockCaseService.getCase).toHaveBeenCalled();
      expect(mockCaseService.getCaseRetentionHistory).toHaveBeenCalled();
    });

    it('should change state value to "Default"', () => {
      const testValue = 'Default';
      component.onStateChanged(testValue);
      expect(component.state).toEqual(testValue);
      expect(fakeHeaderService.showNavigation).toHaveBeenCalled();
    });
  });

  describe('#onRetentionDateChanged', () => {
    it('should change newRetentionDate to date', () => {
      const testDate = new Date(2024, 0, 1);
      component.onRetentionDateChanged(testDate);
      expect(component.newRetentionDate).toEqual(testDate);
    });
  });

  describe('#onRetentionReasonChanged', () => {
    it('should change newRetentionReason value to "Change"', () => {
      const testValue = 'I have reasons';
      component.onRetentionReasonChanged(testValue);
      expect(component.newRetentionReason).toEqual(testValue);
    });
  });

  describe('#onRetentionPermanentChanged', () => {
    it('should change state value to true', () => {
      const testValue = true;
      component.onRetentionPermanentChanged(testValue);
      expect(component.newRetentionPermanent).toEqual(testValue);
    });
  });

  describe('#onRetentionDateChanged', () => {
    it('should change date', () => {
      const testDate = new Date(2024, 0, 1);
      component.onRetentionDateChanged(testDate);
      expect(component.newRetentionDate).toEqual(testDate);
    });
  });

  describe('#onRetentionReasonChanged', () => {
    it('should change state value to "Change"', () => {
      const testValue = 'I have reasons';
      component.onRetentionReasonChanged(testValue);
      expect(component.newRetentionReason).toEqual(testValue);
    });
  });

  it('should transform case details correctly', (done) => {
    component.caseDetails$.subscribe((caseDetails) => {
      expect(caseDetails.details).toEqual({
        'Case ID': mockCaseData.number,
        'Case closed date': mockDatePipe.transform(mockCaseData.closedDateTime?.toISO(), 'dd MMM yyyy') || '-',
        Courthouse: 'Swansea',
        'Judge(s)': [' Judge Judy'],
        'Defendant(s)': [' Defendant Dave'],
      });

      expect(caseDetails.currentRetention).toEqual({
        'Date applied': mockCaseData.retentionDateTimeApplied?.toFormat('dd LLL yyyy'),
        'Retain case until': mockCaseData.retainUntilDateTime?.toFormat('dd LLL yyyy'),
        'DARTS Retention policy applied': 'Manual',
      });
      expect(caseDetails.case_retain_until_date_time).toEqual(mockCaseData.retainUntilDateTime?.toFormat('dd/LL/yyyy'));
      expect(caseDetails.case_id).toBe(1);
      expect(caseDetails.case_number).toBe('C20220620001');
      done();
    });
  });
});
