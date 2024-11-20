import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTask } from '@admin-types/automated-task/automated-task';
import { provideRouter, Router } from '@angular/router';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { of } from 'rxjs';
import { AutomatedTasksComponent } from './automated-tasks.component';

const mockTask: AutomatedTask = {
  id: 1,
  name: 'TestTask',
  description: 'Task 1 description',
  cronExpression: '1 0 0 * * *',
  isActive: true,
};

describe('AutomatedTasksComponent', () => {
  let component: AutomatedTasksComponent;
  let fixture: ComponentFixture<AutomatedTasksComponent>;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomatedTasksComponent],
      providers: [
        {
          provide: AutomatedTasksService,
          useValue: {
            getTasks: jest.fn().mockReturnValue(of([])),
            runTask: jest.fn().mockReturnValue(of()),
            clearLatestTaskStatus: jest.fn(),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AutomatedTasksComponent);
    const router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRunTaskButtonClicked', () => {
    it('calls automatedTasksService.runTask if task is active', () => {
      const runTaskSpy = jest.spyOn(component.automatedTasksService, 'runTask');

      component.onRunTaskButtonClicked(mockTask);

      expect(runTaskSpy).toHaveBeenCalledWith(mockTask);
    });

    it('navigates to the confirmation page if task is not active', () => {
      mockTask.isActive = false;

      component.onRunTaskButtonClicked(mockTask);

      expect(routerNavigateSpy).toHaveBeenCalledWith(
        ['admin/system-configuration/automated-tasks', mockTask.id, 'run'],
        {
          queryParams: { backUrl: component.router.url },
          state: { task: mockTask },
        }
      );
    });
  });

  describe('onDestroy', () => {
    it('calls clearLatestTaskStatus', () => {
      const clearLatestTaskStatusSpy = jest.spyOn(component.automatedTasksService, 'clearLatestTaskStatus');

      component.ngOnDestroy();

      expect(clearLatestTaskStatusSpy).toHaveBeenCalled();
    });
  });
});
