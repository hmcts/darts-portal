import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { formDataFactory } from '../retention-policy-form/retention-policy-form.component.spec';
import { CreateRetentionPolicyComponent } from './create-retention-policy.component';

describe('CreateRetentionPolicyComponent', () => {
  let component: CreateRetentionPolicyComponent;
  let fixture: ComponentFixture<CreateRetentionPolicyComponent>;
  let retentionPoliciesService: RetentionPoliciesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRetentionPolicyComponent],
      providers: [
        {
          provide: RetentionPoliciesService,
          useValue: {
            getRetentionPolicyTypes: jest.fn(() => of([])),
            createRetentionPolicy: jest.fn(() => of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRetentionPolicyComponent);
    component = fixture.componentInstance;
    retentionPoliciesService = TestBed.inject(RetentionPoliciesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call getRetentionPolicyTypes on initialization', () => {
    expect(retentionPoliciesService.getRetentionPolicyTypes).toHaveBeenCalled();
  });

  it('navigate to /admin/retention-policies with query param created=true on successful policy submission', () => {
    const routerSpy = jest.spyOn(component.router, 'navigate');
    const policy = formDataFactory({});

    component.onSubmitPolicy(policy);

    expect(retentionPoliciesService.createRetentionPolicy).toHaveBeenCalledWith(policy);
    expect(routerSpy).toHaveBeenCalledWith(['/admin/retention-policies'], { queryParams: { created: true } });
  });

  it('set error property on policy submission error', () => {
    const errorResponse = new HttpErrorResponse({ error: { type: 'some-error' } });
    jest.spyOn(retentionPoliciesService, 'createRetentionPolicy').mockReturnValue(throwError(() => errorResponse));
    const policy = formDataFactory({});

    component.onSubmitPolicy(policy);

    expect(retentionPoliciesService.createRetentionPolicy).toHaveBeenCalledWith(policy);
    expect(component.error).toEqual('some-error');
  });
});
