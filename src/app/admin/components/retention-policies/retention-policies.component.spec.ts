import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionPolicy, RetentionPolicyData } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { RetentionPoliciesComponent } from './retention-policies.component';

describe('RetentionPoliciesComponent', () => {
  let component: RetentionPoliciesComponent;
  let fixture: ComponentFixture<RetentionPoliciesComponent>;
  let fakeRetentionPoliciesService: Partial<RetentionPoliciesService>;

  const retentionPolicies: RetentionPolicyData[] = [
    {
      id: 0,
      name: 'DARTS Permanent Retention v3',
      display_name: 'Legacy Permanent',
      description: 'lorem ipsum',
      fixed_policy_key: 2,
      duration: '1Y0M0D',
      policy_start_at: '2025-01-01T00:00:00Z',
      policy_end_at: '',
    },
  ];

  beforeEach(async () => {
    fakeRetentionPoliciesService = {
      getRetentionPolicyTypes: jest.fn().mockReturnValue(of(retentionPolicies)),
    };

    await TestBed.configureTestingModule({
      imports: [RetentionPoliciesComponent],
      providers: [
        { provide: RetentionPoliciesService, useValue: fakeRetentionPoliciesService },
        LuxonDatePipe,
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RetentionPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#isPolicyActive', () => {
    it('should return true if policy start date is in the future', () => {
      const policyStart = DateTime.fromISO('3099-03-01');
      const result = component.isPolicyActive(policyStart);
      expect(result).toEqual(true);
    });
    it('should return false if policy start date is in the past', () => {
      const policyStart = DateTime.fromISO('2024-03-01');
      const result = component.isPolicyActive(policyStart);
      expect(result).toEqual(false);
    });
  });

  describe('#filterActivePolicies', () => {
    it('filter active policies', () => {
      const mockData = [
        {
          policyEndAt: null,
        },
        {
          policyEndAt: DateTime.fromISO('2099-01-01T00:00:00Z'),
        },
        {
          policyEndAt: DateTime.fromISO('2024-01-31T00:00:00Z'),
        },
      ] as unknown as RetentionPolicy[];

      const expectedResult = [
        {
          policyEndAt: null,
        },
        {
          policyEndAt: DateTime.fromISO('2099-01-01T00:00:00Z'),
        },
      ];

      const result = component.filterActivePolicies(mockData);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('#filterInactivePolicies', () => {
    it('filter inactive policies', () => {
      const mockData = [
        {
          policyEndAt: null,
        },
        {
          policyEndAt: DateTime.fromISO('2099-01-01T00:00:00Z'),
        },
        {
          policyEndAt: DateTime.fromISO('2024-01-31T00:00:00Z'),
        },
      ] as unknown as RetentionPolicy[];

      const expectedResult = [
        {
          policyEndAt: DateTime.fromISO('2024-01-31T00:00:00Z'),
        },
      ];

      const result = component.filterInactivePolicies(mockData);

      expect(result).toEqual(expectedResult);
    });
  });
});
