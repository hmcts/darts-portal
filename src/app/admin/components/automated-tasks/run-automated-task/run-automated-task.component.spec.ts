import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTask } from '@admin-types/automated-task/automated-task';
import { Navigation, provideRouter, Router } from '@angular/router';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { HeaderService } from '@services/header/header.service';
import { of } from 'rxjs';
import { RunAutomatedTaskComponent } from './run-automated-task.component';

const mockAutomatedTask: AutomatedTask = {
  id: 0,
  name: '',
  description: '',
  cronExpression: '',
  isActive: false,
};

describe('RunAutomatedTaskComponent', () => {
  let component: RunAutomatedTaskComponent;
  let fixture: ComponentFixture<RunAutomatedTaskComponent>;
  let routerNavigateSpy: jest.SpyInstance;
  let hideNavigationSpy: jest.SpyInstance;

  const setup = (task?: AutomatedTask) => {
    TestBed.configureTestingModule({
      imports: [RunAutomatedTaskComponent],
      providers: [
        provideRouter([]),
        {
          provide: AutomatedTasksService,
          useValue: {
            runTask: jest.fn().mockReturnValue(of({})),
            clearLatestTaskStatus: jest.fn(),
          },
        },
      ],
    });

    const router = TestBed.inject(Router);
    const headerService = TestBed.inject(HeaderService);

    routerNavigateSpy = jest.spyOn(router, 'navigate');
    hideNavigationSpy = jest.spyOn(headerService, 'hideNavigation');
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({
      extras: { state: { task } },
    } as unknown as Navigation);

    fixture = TestBed.createComponent(RunAutomatedTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('when task is not provided', () => {
    it('should create', () => {
      setup();
      expect(component.task).toBeUndefined();
      expect(component).toBeTruthy();
    });

    it('should redirect to the previous page', () => {
      setup();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/admin/system-configuration/automated-tasks']);
    });
  });

  describe('when task is provided', () => {
    beforeEach(() => {
      setup(mockAutomatedTask);
    });

    it('should create', () => {
      expect(component.task).toEqual(mockAutomatedTask);
      expect(component).toBeTruthy();
    });

    it('hides the navigation', () => {
      fixture.detectChanges();
      expect(hideNavigationSpy).toHaveBeenCalled();
    });

    it('run the task on confirmation', () => {
      component.onConfirm(mockAutomatedTask);
      expect(component.automatedTasksService.runTask).toHaveBeenCalledWith(mockAutomatedTask);
    });

    it('navigate back after running the task', () => {
      component.onConfirm(mockAutomatedTask);
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/admin/system-configuration/automated-tasks']);
    });
  });
});
