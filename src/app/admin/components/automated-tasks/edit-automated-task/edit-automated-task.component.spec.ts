import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { ActivatedRoute, Navigation, provideRouter, Router } from '@angular/router';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { of } from 'rxjs';
import { EditAutomatedTaskComponent } from './edit-automated-task.component';

describe('ChangeBatchSizeComponent', () => {
  let component: EditAutomatedTaskComponent;
  let fixture: ComponentFixture<EditAutomatedTaskComponent>;
  let router: Router;
  let automatedTasksService: AutomatedTasksService;
  let routerNavigateSpy: jest.SpyInstance;

  const setup = (task?: Partial<AutomatedTaskDetails>) => {
    TestBed.configureTestingModule({
      imports: [EditAutomatedTaskComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: AutomatedTasksService, useValue: { changeBatchSize: jest.fn().mockReturnValue(of({})) } },
      ],
    });

    router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
    jest
      .spyOn(router, 'getCurrentNavigation')
      .mockReturnValue({ extras: { state: { task } } } as unknown as Navigation);

    fixture = TestBed.createComponent(EditAutomatedTaskComponent);
    component = fixture.componentInstance;
    component.task = task as AutomatedTaskDetails;

    automatedTasksService = TestBed.inject(AutomatedTasksService);
    fixture.detectChanges();
  };

  describe('task provided', () => {
    beforeEach(() => {
      setup({ id: 1, batchSize: 10 });
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set batchSizeInput value to task.batchSize', () => {
      expect(component.batchSizeInput.value).toBe(10);
    });

    it('batch size less than 0', () => {
      component.batchSizeInput.setValue(0);
      component.onSubmit();
      expect(component.validationErrorSummary.length).toBe(1);
      expect(component.validationErrorSummary[0].message).toBe(component.minimumErrorMessage);
    });

    it('batch is greater than 2,147,483,647', () => {
      component.batchSizeInput.setValue(2147483648);
      component.onSubmit();
      expect(component.validationErrorSummary.length).toBe(1);
      expect(component.validationErrorSummary[0].message).toBe(component.maximumErrorMessage);
    });

    it('batch size not an integer', () => {
      component.batchSizeInput.setValue('abc' as unknown as number);
      component.onSubmit();
      expect(component.validationErrorSummary.length).toBe(1);
      expect(component.validationErrorSummary[0].message).toBe(component.nonIntegerErrorMessage);
    });

    it('batch size is required', () => {
      component.batchSizeInput.setValue(null as unknown as number);
      component.onSubmit();
      expect(component.validationErrorSummary.length).toBe(1);
      expect(component.validationErrorSummary[0].message).toBe(component.requiredErrorMessage);
    });

    it('should call changeBatchSize and navigate on valid submit', () => {
      component.batchSizeInput.setValue(5);
      component.onSubmit();
      expect(automatedTasksService.changeBatchSize).toHaveBeenCalledWith(1, 5);
      expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], {
        relativeTo: TestBed.inject(ActivatedRoute),
        queryParams: { batchSizeChanged: true },
      });
    });

    it('should not call changeBatchSize and navigate on invalid submit', () => {
      component.batchSizeInput.setValue(0);
      component.onSubmit();
      expect(automatedTasksService.changeBatchSize).not.toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('task not provided', () => {
    it('should navigate back to automated tasks if task is undefined', () => {
      setup();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: TestBed.inject(ActivatedRoute) });
    });
  });
});
