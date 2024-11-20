import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTaskStatus } from '@admin-types/automated-task/automated-task-status';
import { AutomatedTaskStatusComponent } from './automated-task-status.component';

const mockAutomatedTaskStatus: AutomatedTaskStatus = {
  taskId: 1,
  taskName: 'TestTask',
  status: 'success',
};

describe('AutomatedTaskStatusComponent', () => {
  let component: AutomatedTaskStatusComponent;
  let fixture: ComponentFixture<AutomatedTaskStatusComponent>;

  const setup = (task: AutomatedTaskStatus) => {
    TestBed.configureTestingModule({
      imports: [AutomatedTaskStatusComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(AutomatedTaskStatusComponent);
    fixture.componentRef.setInput('latestTaskStatus', task);
    component = fixture.componentInstance;

    fixture.detectChanges();
  };

  it('should create', () => {
    setup(mockAutomatedTaskStatus);
    expect(component).toBeTruthy();
  });

  describe('text signal', () => {
    it('return "Task start request sent" when status is "success"', () => {
      setup(mockAutomatedTaskStatus);
      expect(component.text()).toBe('Task start request sent: TestTask');
    });

    it('return "Task not found" when status is "not-found"', () => {
      setup({ ...mockAutomatedTaskStatus, status: 'not-found' });
      expect(component.text()).toBe('Task not found: TestTask');
    });

    it('return "Task is already running" when status is "already-running"', () => {
      setup({ ...mockAutomatedTaskStatus, status: 'already-running' });
      expect(component.text()).toBe('Task is already running: TestTask');
    });

    it('return "Task {taskId} is inactive" when status is "inactive"', () => {
      setup({ ...mockAutomatedTaskStatus, status: 'inactive' });
      expect(component.text()).toBe('Task 1 is inactive: TestTask');
    });

    it('return "Task {taskId} is active" when status is "active"', () => {
      setup({ ...mockAutomatedTaskStatus, status: 'active' });
      expect(component.text()).toBe('Task 1 is active: TestTask');
    });
  });

  describe('banner signal', () => {
    it('return "success" when status is not "not-found" or "already-running"', () => {
      setup(mockAutomatedTaskStatus);
      expect(component.banner()).toBe('success');
    });

    it('return "warning" when status is "not-found"', () => {
      setup({ ...mockAutomatedTaskStatus, status: 'not-found' });
      expect(component.banner()).toBe('warning');
    });

    it('return "warning" when status is "already-running"', () => {
      setup({ ...mockAutomatedTaskStatus, status: 'already-running' });
      expect(component.banner()).toBe('warning');
    });
  });
});
