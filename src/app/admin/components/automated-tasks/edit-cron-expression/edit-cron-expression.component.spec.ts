import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Navigation, provideRouter, Router } from '@angular/router';
import { AutomatedTaskDetailsState } from '@admin-types/automated-task/automated-task';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { DateTime } from 'luxon';
import { of, throwError } from 'rxjs';
import { EditCronExpressionComponent } from './edit-cron-expression.component';

const taskState: AutomatedTaskDetailsState = {
  id: 1,
  name: 'Task 1',
  description: 'Simulate 202 success',
  cronExpression: '0 0 1 * * *',
  isCronEditable: true,
  batchSize: 1000,
  createdAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
  rpoCsvStartHour: 24,
  rpoCsvEndHour: 72,
  isActive: true,
  createdBy: 1,
  lastModifiedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
  lastModifiedBy: 2,
  createdByFullName: 'Eric Bristow',
  modifiedByFullName: 'Fallon Sherrock',
};

describe('EditCronExpressionComponent', () => {
  let component: EditCronExpressionComponent;
  let fixture: ComponentFixture<EditCronExpressionComponent>;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCronExpressionComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        {
          provide: AutomatedTasksService,
          useValue: {
            getNextCronExecutionTimes: jest.fn().mockReturnValue(of([])),
            changeCronExpression: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
    Object.defineProperty(router, 'currentNavigation', {
      configurable: true,
      value: signal({ extras: { state: { automatedTask: taskState } } } as unknown as Navigation),
    });

    fixture = TestBed.createComponent(EditCronExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prepopulate input', () => {
    const inputElement: HTMLInputElement | null = fixture.nativeElement.querySelector('#cronExpression');

    expect(inputElement).not.toBeNull();
    expect(inputElement?.value).toBe(component.task.cronExpression);
  });

  it('does not navigate away when task state is provided', () => {
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('navigates away when task state is not provided', () => {
    const route = TestBed.inject(ActivatedRoute);
    Object.defineProperty(TestBed.inject(Router), 'currentNavigation', {
      configurable: true,
      value: signal({ extras: { state: {} } } as unknown as Navigation),
    });

    fixture = TestBed.createComponent(EditCronExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: route });
  });

  describe('onContinue', () => {
    it('sets isContinued to true', () => {
      component.onContinue();
      expect(component.isContinued()).toBe(true);
    });
    it('validates the form and sets validationErrorSummary when the form is invalid', () => {
      component.cronControl.setValue('');

      component.onContinue();

      expect(component.validationErrorSummary.length).toBeGreaterThan(0);
    });

    it('does not set validationErrorSummary when the form is valid', () => {
      component.cronControl.setValue('0 0 2 * * *');

      component.onContinue();

      expect(component.validationErrorSummary.length).toBe(0);
    });

    it('calls getNextCronExecutionTimes with the correct parameters', () => {
      const newCronExpression = '0 0 2 * * *';
      component.cronControl.setValue(newCronExpression);

      component.onContinue();

      expect(TestBed.inject(AutomatedTasksService).getNextCronExecutionTimes).toHaveBeenCalledWith(
        component.task.id,
        newCronExpression
      );
    });

    it('returns failure from getNextCronExecutionTimes when cron expression is invalid', () => {
      const newCronExpression = 'invalid cron expression';
      component.cronControl.setValue(newCronExpression);
      const errorResponse = { status: 400 };

      jest
        .spyOn(TestBed.inject(AutomatedTasksService), 'getNextCronExecutionTimes')
        .mockReturnValue(throwError(() => errorResponse));

      component.onContinue();

      expect(component.hasPreviewErrored()).toBe(true);
    });

    it('shows an error summary when getNextCronExecutionTimes returns 404', () => {
      const errorResponse = { status: 404 };
      component.cronControl.setValue('invalid cron expression');

      jest
        .spyOn(TestBed.inject(AutomatedTasksService), 'getNextCronExecutionTimes')
        .mockReturnValue(throwError(() => errorResponse));

      component.onContinue();
      fixture.detectChanges();

      const errorSummary: HTMLElement | null = fixture.nativeElement.querySelector('.govuk-error-summary');

      expect(errorSummary).not.toBeNull();
      expect(errorSummary?.textContent).toContain('There is a problem');
      expect(errorSummary?.textContent).toContain(
        'An unexpected error occurred while generating the preview. Please try again later.'
      );
    });

    it('shows an error summary when getNextCronExecutionTimes returns 400', () => {
      const errorResponse = { status: 400 };
      component.cronControl.setValue('invalid cron expression');

      jest
        .spyOn(TestBed.inject(AutomatedTasksService), 'getNextCronExecutionTimes')
        .mockReturnValue(throwError(() => errorResponse));

      component.onContinue();
      fixture.detectChanges();

      const errorSummary: HTMLElement | null = fixture.nativeElement.querySelector('.govuk-error-summary');

      expect(errorSummary).not.toBeNull();
      expect(errorSummary?.textContent).toContain('There is a problem');
      expect(errorSummary?.textContent).toContain('Invalid cron expression');
    });

    it('shows an error summary when getNextCronExecutionTimes returns 500', () => {
      const errorResponse = { status: 500 };
      component.cronControl.setValue('0 0 2 * * *');

      jest
        .spyOn(TestBed.inject(AutomatedTasksService), 'getNextCronExecutionTimes')
        .mockReturnValue(throwError(() => errorResponse));

      component.onContinue();
      fixture.detectChanges();

      const errorSummary: HTMLElement | null = fixture.nativeElement.querySelector('.govuk-error-summary');

      expect(errorSummary).not.toBeNull();
      expect(errorSummary?.textContent).toContain('There is a problem');
      expect(errorSummary?.textContent).toContain(
        'An unexpected error occurred while generating the preview. Please try again later.'
      );
    });

    it('sets isPreviewMode to true', () => {
      component.onContinue();
      expect(component.isPreviewMode()).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('calls changeCronExpression with the correct parameters', () => {
      const newCronExpression = '0 0 2 * * *';
      component.cronControl.setValue(newCronExpression);

      component.onSubmit();

      expect(TestBed.inject(AutomatedTasksService).changeCronExpression).toHaveBeenCalledWith(
        component.task.id,
        newCronExpression
      );
    });
  });
});
