import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TabDirective } from '@directives/tab.directive';
import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { of } from 'rxjs';
import { AutomatedTaskStatusComponent } from '../automated-tasks/automated-task-status/automated-task-status.component';
import { SystemConfigurationComponent } from './system-configuration.component';

describe('SystemConfigurationComponent', () => {
  let component: SystemConfigurationComponent;
  let fixture: ComponentFixture<SystemConfigurationComponent>;
  let locationReplaceStateSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemConfigurationComponent, AutomatedTaskStatusComponent],
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

    locationReplaceStateSpy = jest.spyOn(TestBed.inject(Location), 'replaceState');

    fixture = TestBed.createComponent(SystemConfigurationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTabChange', () => {
    it('should change url to /retention-policies', () => {
      component.currentTab = 'different tab';
      component.onTabChanged({ name: 'Retention policies' } as unknown as TabDirective);
      expect(locationReplaceStateSpy).toHaveBeenCalledWith('/admin/system-configuration/retention-policies');
    });

    it('should change url to /event-mappings', () => {
      component.onTabChanged({ name: 'Event mappings' } as unknown as TabDirective);
      expect(locationReplaceStateSpy).toHaveBeenCalledWith('/admin/system-configuration/event-mappings');
    });

    it('should change url to /automated-tasks', () => {
      component.onTabChanged({ name: 'Automated tasks' } as unknown as TabDirective);
      expect(locationReplaceStateSpy).toHaveBeenCalledWith('/admin/system-configuration/automated-tasks');
    });

    it('updates the current tab', () => {
      component.currentTab = 'different tab';
      component.onTabChanged({ name: 'Event mappings' } as unknown as TabDirective);
      expect(component.currentTab).toBe('Event mappings');
    });

    it('should not navigate if the tab is the same as the current tab', () => {
      component.currentTab = 'Retention policies';
      component.onTabChanged({ name: 'Retention policies' } as unknown as TabDirective);
      expect(locationReplaceStateSpy).not.toHaveBeenCalled();
    });
  });

  describe('getTabFromUrl', () => {
    it('should return "Retention policies" if url is "/admin/system-configuration/retention-policies"', () => {
      const tab = component.getTabFromUrl('/admin/system-configuration/retention-policies');
      expect(tab).toBe('Retention policies');
    });

    it('should return "Event mapping" if url is "/admin/system-configuration/event-mapping"', () => {
      const tab = component.getTabFromUrl('/admin/system-configuration/event-mappings');
      expect(tab).toBe('Event mappings');
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

    it('should return "event-mappings" if tab is "Event mappings"', () => {
      const url = component.getUrlFromTab('Event mappings');
      expect(url).toBe('/admin/system-configuration/event-mappings');
    });

    it('should return "automated-tasks" if tab is "Automated tasks"', () => {
      const url = component.getUrlFromTab('Automated tasks');
      expect(url).toBe('/admin/system-configuration/automated-tasks');
    });
  });
});
