import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { AutomatedTaskStatusComponent } from './automated-task-status.component';

describe('AutomatedTaskStatusComponent', () => {
  let component: AutomatedTaskStatusComponent;
  let fixture: ComponentFixture<AutomatedTaskStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomatedTaskStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutomatedTaskStatusComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    // no status set, banner should not be displayed
    expect(fixture.debugElement.query(By.directive(GovukBannerComponent))).toBeFalsy();
    expect(component).toBeTruthy();
  });

  describe('text signal', () => {
    it('should return "Task start request sent" when status is "success"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'success']);
      expect(component.text()).toBe('Task start request sent: TestTask');
    });

    it('should return "Task not found" when status is "not-found"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'not-found']);
      expect(component.text()).toBe('Task not found: TestTask');
    });

    it('should return "Task is already running" when status is "already-running"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'already-running']);
      expect(component.text()).toBe('Task is already running: TestTask');
    });

    it('should return "Task {taskId} is inactive" when status is "inactive"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'inactive']);
      fixture.componentRef.setInput('taskId', 1);
      expect(component.text()).toBe('Task 1 is inactive: TestTask');
    });

    it('should return "Task {taskId} is active" when status is "active"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'active']);
      fixture.componentRef.setInput('taskId', 1);
      expect(component.text()).toBe('Task 1 is active: TestTask');
    });
  });

  describe('banner signal', () => {
    it('should return "success" when status is not "not-found" or "already-running"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'success']);
      expect(component.banner()).toBe('success');
    });

    it('should return "warning" when status is "not-found"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'not-found']);
      expect(component.banner()).toBe('warning');
    });

    it('should return "warning" when status is "already-running"', () => {
      fixture.componentRef.setInput('status', ['TestTask', 'already-running']);
      expect(component.banner()).toBe('warning');
    });
  });
});
