import { TestBed } from '@angular/core/testing';

import { AutomatedTask, AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DateTime } from 'luxon';
import { AutomatedTasksService } from './automated-tasks.service';

describe('AutomatedTasksService', () => {
  let service: AutomatedTasksService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), AutomatedTasksService],
    });

    service = TestBed.inject(AutomatedTasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('calls GET "/api/admin/automated-tasks" endpoint', () => {
      service.getTasks().subscribe();
      const req = httpMock.expectOne('/api/admin/automated-tasks');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('maps the response to AutomatedTask[]', () => {
      const tasks = [
        {
          id: 1,
          name: 'Task 1',
          description: 'Task 1 description',
          cron_expression: '1 0 0 * * *',
          is_active: true,
        },
        {
          id: 2,
          name: 'Task 2',
          description: 'Task 2 description',
          cron_expression: '2 0 0 * * *',
          is_active: false,
        },
      ];

      let result = [] as AutomatedTask[];

      service.getTasks().subscribe((tasks) => (result = tasks));

      const req = httpMock.expectOne('/api/admin/automated-tasks');
      req.flush(tasks);

      expect(result).toEqual([
        {
          id: 1,
          name: 'Task 1',
          description: 'Task 1 description',
          cronExpression: '1 0 0 * * *',
          isActive: true,
        },
        {
          id: 2,
          name: 'Task 2',
          description: 'Task 2 description',
          cronExpression: '2 0 0 * * *',
          isActive: false,
        },
      ]);
    });
  });

  describe('runTask', () => {
    it('calls POST "/api/admin/automated-tasks/:taskId/run" endpoint', () => {
      service.runTask({ id: 1, name: 'test' } as AutomatedTask).subscribe();
      const req = httpMock.expectOne('/api/admin/automated-tasks/1/run');
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('sets the latest task status', () => {
      service.runTask({ id: 1, name: 'test' } as AutomatedTask).subscribe();

      const req = httpMock.expectOne('/api/admin/automated-tasks/1/run');
      req.flush({});

      expect(service.getLatestTaskStatus()()).toEqual({
        taskId: 1,
        taskName: 'test',
        status: 'success',
      });
    });

    it('handles 404 error and sets latest task status', () => {
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.runTask({ id: 1, name: 'test' } as AutomatedTask).subscribe();

      const req = httpMock.expectOne('/api/admin/automated-tasks/1/run');
      req.flush({}, errorResponse);

      expect(service.getLatestTaskStatus()()).toEqual({
        taskId: 1,
        taskName: 'test',
        status: 'not-found',
      });
    });

    it('handles 409 error and sets latest task status', () => {
      const errorResponse = { status: 409, statusText: 'Conflict' };

      service.runTask({ id: 1, name: 'test' } as AutomatedTask).subscribe();

      const req = httpMock.expectOne('/api/admin/automated-tasks/1/run');
      req.flush({}, errorResponse);

      expect(service.getLatestTaskStatus()()).toEqual({
        taskId: 1,
        taskName: 'test',
        status: 'already-running',
      });
    });
  });

  describe('toggleTaskActiveStatus', () => {
    it('calls PATCH "/api/admin/automated-tasks/:taskId" endpoint', () => {
      service
        .toggleTaskActiveStatus({
          id: 1,
          isActive: true,
        } as AutomatedTaskDetails)
        .subscribe();

      const req = httpMock.expectOne('/api/admin/automated-tasks/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ is_active: false });

      req.flush({});
    });

    it('toggles the active status and maps results', () => {
      let result = {} as AutomatedTaskDetails;

      service
        .toggleTaskActiveStatus({
          id: 1,
          name: 'name',
          isActive: true,
        } as AutomatedTaskDetails)
        .subscribe((task) => (result = task));

      const req = httpMock.expectOne('/api/admin/automated-tasks/1');
      req.flush({
        id: 1,
        name: 'name',
        is_active: false,
      });

      expect(result.id).toBe(1);
      expect(result.isActive).toBe(false);
      expect(service.getLatestTaskStatus()()).toEqual({
        taskId: 1,
        taskName: 'name',
        status: 'inactive',
      });
    });

    it('maps the response to AutomatedTaskDetails', () => {
      let result = {} as AutomatedTaskDetails;

      service
        .toggleTaskActiveStatus({
          id: 1,
          isActive: true,
        } as AutomatedTaskDetails)
        .subscribe((task) => (result = task));

      const req = httpMock.expectOne('/api/admin/automated-tasks/1');
      req.flush({
        id: 1,
        name: 'Task 1',
        description: 'Task 1 description',
        cron_expression: '1 0 0 * * *',
        is_active: false,
        is_cron_editable: true,
        created_at: '2021-01-02T00:00:00Z',
        created_by: 3,
        last_modified_at: '2021-01-02T00:00:00Z',
        last_modified_by: 3,
      });

      expect(result).toEqual({
        id: 1,
        name: 'Task 1',
        description: 'Task 1 description',
        cronExpression: '1 0 0 * * *',
        isActive: false,
        isCronEditable: true,
        createdAt: DateTime.fromISO('2021-01-02T00:00:00Z'),
        createdBy: 3,
        lastModifiedAt: DateTime.fromISO('2021-01-02T00:00:00Z'),
        lastModifiedBy: 3,
      });
    });
  });

  describe('getTask', () => {
    it('calls GET "/api/admin/automated-tasks/:taskId" endpoint', () => {
      service.getTask(1).subscribe();
      const req = httpMock.expectOne('/api/admin/automated-tasks/1');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('maps the response to AutomatedTaskDetails', () => {
      let result = {} as AutomatedTaskDetails;

      service.getTask(1).subscribe((task) => (result = task));

      const req = httpMock.expectOne('/api/admin/automated-tasks/1');
      req.flush({
        id: 1,
        name: 'Task 1',
        description: 'Task 1 description',
        cron_expression: '1 0 0 * * *',
        is_active: true,
        is_cron_editable: true,
        created_at: '2021-01-02T00:00:00Z',
        created_by: 3,
        last_modified_at: '2021-01-02T00:00:00Z',
        last_modified_by: 3,
      });

      expect(result).toEqual({
        id: 1,
        name: 'Task 1',
        description: 'Task 1 description',
        cronExpression: '1 0 0 * * *',
        isActive: true,
        isCronEditable: true,
        createdAt: DateTime.fromISO('2021-01-02T00:00:00Z'),
        createdBy: 3,
        lastModifiedAt: DateTime.fromISO('2021-01-02T00:00:00Z'),
        lastModifiedBy: 3,
      });
    });
  });
});
