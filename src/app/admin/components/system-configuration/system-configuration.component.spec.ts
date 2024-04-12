import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { TabDirective } from '@directives/tab.directive';
import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { of } from 'rxjs';
import { SystemConfigurationComponent } from './system-configuration.component';

describe('SystemConfigurationComponent', () => {
  let component: SystemConfigurationComponent;
  let fixture: ComponentFixture<SystemConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemConfigurationComponent],
      providers: [
        {
          provide: RetentionPoliciesService,
          useValue: {
            getRetentionPolicyTypes: jest.fn().mockReturnValue(of([])),
          },
        },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTabChange', () => {
    it('should navigate to the retention policies tab', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      component.currentTab = 'different tab';
      component.onTabChanged({ name: 'Retention policies' } as unknown as TabDirective);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/system-configuration/retention-policies']);
    });

    it('should navigate to the event mapping tab', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      component.onTabChanged({ name: 'Event mapping' } as unknown as TabDirective);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/system-configuration/event-mapping']);
    });

    it('should navigate to the automated tasks tab', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      component.onTabChanged({ name: 'Automated tasks' } as unknown as TabDirective);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/system-configuration/automated-tasks']);
    });

    it('should not navigate if the tab is the same as the current tab', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      component.currentTab = 'Retention policies';
      component.onTabChanged({ name: 'Retention policies' } as unknown as TabDirective);
      expect(routerSpy).not.toHaveBeenCalled();
    });
  });

  describe('getTabFromUrl', () => {
    it('should return "Retention policies" if url is "/admin/system-configuration/retention-policies"', () => {
      const tab = component.getTabFromUrl('/admin/system-configuration/retention-policies');
      expect(tab).toBe('Retention policies');
    });

    it('should return "Event mapping" if url is "/admin/system-configuration/event-mapping"', () => {
      const tab = component.getTabFromUrl('/admin/system-configuration/event-mapping');
      expect(tab).toBe('Event mapping');
    });

    it('should return "Automated tasks" if url is "/admin/system-configuration/automated-tasks"', () => {
      const tab = component.getTabFromUrl('/admin/system-configuration/automated-tasks');
      expect(tab).toBe('Automated tasks');
    });
  });

  describe('getUrlFromTab', () => {
    it('should return "retention-policies" if tab is "Retention policies"', () => {
      const url = component.getUrlFromTab('Retention policies');
      expect(url).toBe('/admin/system-configuration/retention-policies');
    });

    it('should return "event-mapping" if tab is "Event mapping"', () => {
      const url = component.getUrlFromTab('Event mapping');
      expect(url).toBe('/admin/system-configuration/event-mapping');
    });

    it('should return "automated-tasks" if tab is "Automated tasks"', () => {
      const url = component.getUrlFromTab('Automated tasks');
      expect(url).toBe('/admin/system-configuration/automated-tasks');
    });
  });
});
