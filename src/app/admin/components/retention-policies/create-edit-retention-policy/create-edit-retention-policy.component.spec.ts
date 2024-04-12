import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { formDataFactory } from '../retention-policy-form/retention-policy-form.component.spec';
import { CreateEditRetentionPolicyComponent } from './create-edit-retention-policy.component';

describe('CreateEditRetentionPolicyComponent', () => {
  let component: CreateEditRetentionPolicyComponent;
  let fixture: ComponentFixture<CreateEditRetentionPolicyComponent>;
  let retentionPoliciesService: RetentionPoliciesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditRetentionPolicyComponent],
      providers: [
        {
          provide: RetentionPoliciesService,
          useValue: {
            getRetentionPolicyTypes: jest.fn(() => of([])),
            createRetentionPolicy: jest.fn(() => of({})),
            editRetentionPolicy: jest.fn(() => of({})),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } } as unknown as ActivatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditRetentionPolicyComponent);
    component = fixture.componentInstance;
    retentionPoliciesService = TestBed.inject(RetentionPoliciesService);
    fixture.detectChanges();
  });

  describe('create context (default)', () => {
    beforeEach(() => {
      component.context = 'create';
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
      expect(routerSpy).toHaveBeenCalledWith(['admin/system-configuration/retention-policies'], {
        queryParams: { created: true },
      });
    });

    it('set error property on policy submission error', () => {
      const errorResponse = new HttpErrorResponse({ error: { type: 'some-error' } });
      jest.spyOn(retentionPoliciesService, 'createRetentionPolicy').mockReturnValue(throwError(() => errorResponse));
      const policy = formDataFactory({});

      component.onSubmitPolicy(policy);

      expect(retentionPoliciesService.createRetentionPolicy).toHaveBeenCalledWith(policy);
      expect(component.error).toEqual('some-error');
    });

    it('should hide navigation on initialization', () => {
      const headerService = TestBed.inject(HeaderService);
      const hideNavigationSpy = jest.spyOn(headerService, 'hideNavigation');

      component.ngOnInit();

      expect(hideNavigationSpy).toHaveBeenCalled();
    });

    it('should set title based on context', () => {
      component.context = 'create';

      component.ngOnInit();

      expect(component.title).toEqual('Create new policy');
    });
  });

  describe('edit context', () => {
    beforeEach(() => {
      component.context = 'edit';
    });

    it('should set title to Edit policy', () => {
      component.ngOnInit();
      expect(component.title).toEqual('Edit policy');
    });

    it('navigate to /admin/retention-policies with query param updated=true on successful policy submission', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      const policy = formDataFactory({});

      component.onSubmitPolicy(policy);

      expect(retentionPoliciesService.editRetentionPolicy).toHaveBeenCalledWith(policy, '1');
      expect(routerSpy).toHaveBeenCalledWith(['admin/system-configuration/retention-policies'], {
        queryParams: { updated: true },
      });
    });

    it('set error property on policy submission error', () => {
      const errorResponse = new HttpErrorResponse({ error: { type: 'some-error' } });
      jest.spyOn(retentionPoliciesService, 'editRetentionPolicy').mockReturnValue(throwError(() => errorResponse));
      const policy = formDataFactory({});

      component.onSubmitPolicy(policy);

      expect(retentionPoliciesService.editRetentionPolicy).toHaveBeenCalledWith(policy, '1');
      expect(component.error).toEqual('some-error');
    });
  });
});
