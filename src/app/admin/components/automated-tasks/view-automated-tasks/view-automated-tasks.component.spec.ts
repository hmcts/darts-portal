import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { User } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukSummaryListRowDirective } from '@directives/govuk-summary-list';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AutomatedTaskStatusComponent } from '../automated-task-status/automated-task-status.component';
import { ViewAutomatedTasksComponent } from './view-automated-tasks.component';

const task: AutomatedTaskDetails = {
  id: 1,
  name: 'Task 1',
  description: 'Task 1 description',
  cronExpression: '1 0 0 * * *',
  isCronEditable: true,
  batchSize: 1000,
  createdAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
  createdBy: 1,
  lastModifiedAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
  lastModifiedBy: 2,
  isActive: true,
};

const users = [
  { id: 1, fullName: 'User 1' },
  { id: 2, fullName: 'User 2' },
] as User[];

describe('ViewAutomatedTasksComponent', () => {
  let component: ViewAutomatedTasksComponent;
  let fixture: ComponentFixture<ViewAutomatedTasksComponent>;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAutomatedTasksComponent, AutomatedTaskStatusComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } },
        {
          provide: AutomatedTasksService,
          useValue: {
            getTask: jest.fn().mockReturnValue(of(task)),
            runTask: jest.fn().mockReturnValue(of({})),
            toggleTaskActiveStatus: jest.fn().mockReturnValue(of(task)),
            getLatestTaskStatus: jest.fn().mockReturnValue(signal(null)),
            clearLatestTaskStatus: jest.fn(),
          },
        },
        { provide: UserAdminService, useValue: { getUsersById: jest.fn().mockReturnValue(of(users)) } },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAutomatedTasksComponent);
    routerNavigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('armAttributeType is REPLAY', () => {
    it('displays arm replay start and end times', () => {
      component.task.set({
        ...task,
        armAttributeType: 'REPLAY',
        armReplayStartTs: DateTime.fromISO('2021-01-01T01:00:00Z'),
        armReplayEndTs: DateTime.fromISO('2021-01-01T02:00:00Z'),
      });

      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.directive(GovukSummaryListRowDirective));
      const startTimeRow = rows.find((row) => row.nativeElement.textContent.includes('ARM Replay start time'));
      const endTimeRow = rows.find((row) => row.nativeElement.textContent.includes('ARM Replay end time'));

      expect(startTimeRow?.nativeElement.textContent).toContain('Fri 1 Jan 2021 at 01:00:00');
      expect(endTimeRow?.nativeElement.textContent).toContain('Fri 1 Jan 2021 at 02:00:00');
    });
  });

  describe('armAttributeType is RPO', () => {
    it('displays RPO CSV start and end time', () => {
      component.task.set({
        ...task,
        armAttributeType: 'RPO',
        rpoCsvStartHour: 24,
        rpoCsvEndHour: 72,
      });

      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.directive(GovukSummaryListRowDirective));
      const startHourRow = rows.find((row) => row.nativeElement.textContent.includes('RPO CSV start hour'));
      const endHourRow = rows.find((row) => row.nativeElement.textContent.includes('RPO CSV end hour'));

      expect(startHourRow?.nativeElement.textContent).toContain('24');
      expect(endHourRow?.nativeElement.textContent).toContain('72');
    });
  });

  describe('onRunTaskButtonClicked', () => {
    it('runs the task if it is active', () => {
      component.task.set({ ...task, isActive: true });

      component.onRunTaskButtonClicked(task);

      expect(component.taskService.runTask).toHaveBeenCalledWith(task);
    });

    it('navigates to the confirmation page if the task is not active', () => {
      component.task.set({ ...task, isActive: false });

      component.onRunTaskButtonClicked(task);

      expect(routerNavigateSpy).toHaveBeenCalledWith(['admin/system-configuration/automated-tasks', task.id, 'run'], {
        queryParams: { backUrl: component.router.url },
        state: { task },
      });
    });
  });

  describe('with labelChanged input', () => {
    it('displays success banner', () => {
      fixture.componentRef.setInput('labelChanged', 'Label text');
      fixture.detectChanges();
      component.task.set(task);

      const banner = fixture.debugElement.query(By.css('#success-message'));
      expect(banner.nativeElement.textContent).toContain('Label text successfully updated');
    });
  });

  describe('onActivateDeactiveButtonClicked', () => {
    it('toggles the task active status', () => {
      component.onActivateDeactiveButtonClicked();

      expect(component.taskService.toggleTaskActiveStatus).toHaveBeenCalledWith({
        ...task,
        createdByFullName: 'User 1',
        modifiedByFullName: 'User 2',
      });
    });

    it('updates the task after toggling the active status', () => {
      component.onActivateDeactiveButtonClicked();

      expect(component.task()).toEqual({ ...task, createdByFullName: 'User 1', modifiedByFullName: 'User 2' });
    });
  });

  describe('ngOnDestroy', () => {
    it('clears the latest task status', () => {
      component.ngOnDestroy();

      expect(component.taskService.clearLatestTaskStatus).toHaveBeenCalled();
    });
  });
});
