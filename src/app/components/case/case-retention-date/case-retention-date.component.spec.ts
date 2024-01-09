import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { CaseRetentionHistory } from '@darts-types/case-retention-history.interface';
import { Case } from '@darts-types/case.interface';
import { CaseService } from '@services/case/case.service';
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
    case_id: 1,
    courthouse: 'Swansea',
    case_number: 'C20220620001',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    retain_until_date_time: '2030-08-10T11:23:24.858Z',
    case_closed_date_time: '2023-08-15T14:57:24.858Z',
    retention_date_time_applied: '2023-12-12T11:02:24.858Z',
    retention_policy_applied: 'Manual',
  };

  const mockCaseService = {
    getCase: () => of(mockCaseData),
    getCaseRetentionHistory: jest.fn(),
  } as unknown as CaseService;
  const mockDatePipe = new DatePipe('en-GB');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRetentionDateComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DatePipe },
        { provide: CaseService, useValue: mockCaseService },
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

  it('should transform case details correctly', (done) => {
    component.caseDetails$.subscribe((caseDetails) => {
      expect(caseDetails.details).toEqual({
        'Case ID': 1,
        'Case closed date': mockDatePipe.transform(mockCaseData.case_closed_date_time, 'dd MMM yyyy') || '-',
        Courthouse: 'Swansea',
        'Judge(s)': ['Judge Judy'],
        'Defendant(s)': ['Defendant Dave'],
      });

      expect(caseDetails.currentRetention).toEqual({
        'Date applied': mockDatePipe.transform(mockCaseData.retention_date_time_applied, 'dd MMM yyyy'),
        'Retain case until': mockDatePipe.transform(mockCaseData.retain_until_date_time, 'dd MMM yyyy'),
        'DARTS Retention policy applied': 'Manual',
      });
      expect(caseDetails.case_id).toBe(1);
      expect(caseDetails.case_number).toBe('C20220620001');
      done();
    });
  });
});
