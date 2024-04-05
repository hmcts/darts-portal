import { CreateRetentionPolicy, RetentionPolicy, RetentionPolicyData } from '@admin-types/index';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DateTime, Settings } from 'luxon';
import { formDataFactory } from '../../components/retention-policies/retention-policy-form/retention-policy-form.component.spec';
import { RetentionPoliciesService } from './retention-policies.service';

Settings.defaultZone = 'utc';

describe('RetentionPoliciesService', () => {
  let service: RetentionPoliciesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(RetentionPoliciesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getRetentionPolicyTypes', () => {
    it('should map Retention Policy Data', () => {
      const mockRetentionPolicies: RetentionPolicyData[] = [
        {
          id: 0,
          name: 'DARTS Permanent Retention v3',
          display_name: 'Legacy Permanent',
          description: 'lorem ipsum',
          fixed_policy_key: '2',
          duration: '1Y0M0D',
          policy_start_at: '2024-01-01T00:00:00Z',
          policy_end_at: '',
        },
        {
          id: 1,
          name: 'DARTS Standard Retention v3',
          display_name: 'Legacy Standard',
          description: 'lorem ipsum',
          fixed_policy_key: '2',
          duration: '1Y6M0D',
          policy_start_at: '2024-01-01T00:00:00Z',
          policy_end_at: '2034-01-01T00:00:00Z',
        },
      ];

      const expectedRetentionPolicies: RetentionPolicy[] = [
        {
          id: 0,
          name: 'DARTS Permanent Retention v3',
          displayName: 'Legacy Permanent',
          description: 'lorem ipsum',
          fixedPolicyKey: '2',
          duration: '1Y0M0D',
          policyStartAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          policyEndAt: null,
        },
        {
          id: 1,
          name: 'DARTS Standard Retention v3',
          displayName: 'Legacy Standard',
          description: 'lorem ipsum',
          fixedPolicyKey: '2',
          duration: '1Y6M0D',
          policyStartAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          policyEndAt: DateTime.fromISO('2034-01-01T00:00:00Z'),
        },
      ];

      let result;

      service.getRetentionPolicyTypes().subscribe((retentionPolicies) => {
        result = retentionPolicies;
      });

      const req = httpMock.expectOne(`api/admin/retention-policy-types`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockRetentionPolicies);

      expect(result).toEqual(expectedRetentionPolicies);
    });
  });

  describe('#createRetentionPolicy', () => {
    it('should map Retention Policy Data', () => {
      const mockPolicyFormData = formDataFactory({});

      const policyDto: CreateRetentionPolicy = {
        name: 'test',
        display_name: 'test',
        description: 'test',
        fixed_policy_key: '1',
        duration: '1Y0M0D',
        policy_start_at: '2025-01-01T11:11:00.000Z',
      };

      const expectedMappedPolicy: RetentionPolicy = {
        id: 0,
        name: 'test',
        displayName: 'test',
        description: 'test',
        fixedPolicyKey: '1',
        duration: '1Y0M0D',
        policyStartAt: DateTime.fromISO('2025-01-01T11:11:00.000Z'),
        policyEndAt: null,
      };

      let result;

      service.createRetentionPolicy(mockPolicyFormData).subscribe((policy) => {
        result = policy;
      });

      const req = httpMock.expectOne(`api/admin/retention-policy-types?is_revision=false`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(policyDto);

      req.flush({ ...policyDto, id: 0 });

      expect(result).toEqual(expectedMappedPolicy);
    });
  });
});
