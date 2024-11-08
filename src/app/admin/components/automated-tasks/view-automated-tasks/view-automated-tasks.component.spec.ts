import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { User } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GovukSummaryListRowDirective } from '@directives/govuk-summary-list';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of, throwError } from 'rxjs';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAutomatedTasksComponent, AutomatedTaskStatusComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } },
        {
          provide: AutomatedTasksService,
          useValue: {
            getTask: jest.fn().mockReturnValue(of(task)),
            runTask: jest.fn(),
            toggleTaskActiveStatus: jest.fn().mockReturnValue(of(task)),
          },
        },
        { provide: UserAdminService, useValue: { getUsersById: jest.fn().mockReturnValue(of(users)) } },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAutomatedTasksComponent);
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
        rpoCsvStartHour: DateTime.fromISO('2021-01-01T03:00:00Z'),
        rpoCsvEndHour: DateTime.fromISO('2021-01-01T04:00:00Z'),
      });

      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.directive(GovukSummaryListRowDirective));
      const startTimeRow = rows.find((row) => row.nativeElement.textContent.includes('RPO CSV start hour'));
      const endTimeRow = rows.find((row) => row.nativeElement.textContent.includes('RPO CSV end hour'));

      expect(startTimeRow?.nativeElement.textContent).toContain('Fri 1 Jan 2021 at 03:00:00');
      expect(endTimeRow?.nativeElement.textContent).toContain('Fri 1 Jan 2021 at 04:00:00');
    });
  });

  describe('onRunTaskButtonClicked', () => {
    it('should run the task', () => {
      const taskService = TestBed.inject(AutomatedTasksService);
      const runTaskSpy = jest.spyOn(taskService, 'runTask').mockReturnValue(of());

      component.onRunTaskButtonClicked(task.name);

      expect(runTaskSpy).toHaveBeenCalledWith(1);
    });

    it('should set the task run status to success', () => {
      const taskService = TestBed.inject(AutomatedTasksService);
      jest.spyOn(taskService, 'runTask').mockReturnValue(of({} as HttpResponse<void>));

      component.onRunTaskButtonClicked(task.name);

      expect(component.taskRunStatus()?.[0]).toBe(task.name);
      expect(component.taskRunStatus()?.[1]).toBe('success');
    });

    it('should set the task run status to not-found', () => {
      const taskService = TestBed.inject(AutomatedTasksService);
      jest.spyOn(taskService, 'runTask').mockReturnValue(throwError(() => ({ status: 404 })));

      component.onRunTaskButtonClicked(task.name);

      expect(component.taskRunStatus()?.[0]).toBe(task.name);
      expect(component.taskRunStatus()?.[1]).toBe('not-found');
    });

    it('should set the task run status to already-running', () => {
      const taskService = TestBed.inject(AutomatedTasksService);
      jest.spyOn(taskService, 'runTask').mockReturnValue(throwError(() => ({ status: 409 })));

      component.onRunTaskButtonClicked(task.name);

      expect(component.taskRunStatus()?.[0]).toBe(task.name);
      expect(component.taskRunStatus()?.[1]).toBe('already-running');
    });
  });

  describe('onActivateDeactiveButtonClicked', () => {
    it('should toggle the task active status', () => {
      const taskService = TestBed.inject(AutomatedTasksService);
      jest.spyOn(taskService, 'toggleTaskActiveStatus').mockReturnValue(of(task));

      component.onActivateDeactiveButtonClicked(task.name);

      expect(component.taskRunStatus()?.[0]).toBe(task.name);
      expect(component.taskRunStatus()?.[1]).toBe('active');

      expect(component.task()).toEqual({ ...task, createdByFullName: 'User 1', modifiedByFullName: 'User 2' });
    });

    it('should set the task run status to inactive', () => {
      const taskService = TestBed.inject(AutomatedTasksService);
      jest.spyOn(taskService, 'toggleTaskActiveStatus').mockReturnValue(of({ ...task, isActive: false }));

      component.onActivateDeactiveButtonClicked(task.name);

      expect(component.taskRunStatus()?.[0]).toBe(task.name);
      expect(component.taskRunStatus()?.[1]).toBe('inactive');
    });
  });
});
