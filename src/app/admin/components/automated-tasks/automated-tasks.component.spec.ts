import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpResponse } from '@angular/common/http';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { of, throwError } from 'rxjs';
import { AutomatedTasksComponent } from './automated-tasks.component';

describe('AutomatedTasksComponent', () => {
  let component: AutomatedTasksComponent;
  let fixture: ComponentFixture<AutomatedTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomatedTasksComponent],
      providers: [
        {
          provide: AutomatedTasksService,
          useValue: { getTasks: jest.fn().mockReturnValue(of([])), runTask: jest.fn().mockReturnValue(of()) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AutomatedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRunTaskButtonClicked', () => {
    it('emits "success" when the task is run successfully', () => {
      const runTaskSpy = jest
        .spyOn(component.automatedTasksService, 'runTask')
        .mockReturnValue(of({} as unknown as HttpResponse<void>));
      const taskRunSpy = jest.spyOn(component.taskRun, 'emit');

      component.onRunTaskButtonClicked(1, 'TestTask');

      expect(runTaskSpy).toHaveBeenCalledWith(1);
      expect(taskRunSpy).toHaveBeenCalledWith(['TestTask', 'success']);
    });

    it('emits "not-found" when the task is not found', () => {
      const runTaskSpy = jest
        .spyOn(component.automatedTasksService, 'runTask')
        .mockReturnValue(throwError(() => ({ status: 404 }) as unknown as HttpResponse<void>));
      const taskRunSpy = jest.spyOn(component.taskRun, 'emit');

      component.onRunTaskButtonClicked(2, 'TestTask');

      expect(runTaskSpy).toHaveBeenCalledWith(2);
      expect(taskRunSpy).toHaveBeenCalledWith(['TestTask', 'not-found']);
    });

    it('emits "already-running" when the task is already running', () => {
      const runTaskSpy = jest
        .spyOn(component.automatedTasksService, 'runTask')
        .mockReturnValue(throwError(() => ({ status: 409 }) as unknown as HttpResponse<void>));
      const taskRunSpy = jest.spyOn(component.taskRun, 'emit');

      component.onRunTaskButtonClicked(3, 'TestTask');

      expect(runTaskSpy).toHaveBeenCalledWith(3);
      expect(taskRunSpy).toHaveBeenCalledWith(['TestTask', 'already-running']);
    });
  });
});
