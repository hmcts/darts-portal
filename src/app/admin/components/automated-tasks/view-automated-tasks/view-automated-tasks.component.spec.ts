import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { User } from '@admin-types/index';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAutomatedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('task details', () => {
    it('should return the task details', () => {
      expect(component.details()).toEqual({
        ID: 1,
        Name: 'Task 1',
        Description: 'Task 1 description',
        'Cron expression': '1 0 0 * * *',
        'Cron editable': 'Yes',
        'Date created': 'Fri 1 Jan 2021 at 00:00:00',
        'Created by': 'User 1',
        'Date modified': 'Fri 1 Jan 2021 at 00:00:00',
        'Modified by': 'User 2',
      });
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
