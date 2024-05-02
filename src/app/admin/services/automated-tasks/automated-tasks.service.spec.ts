import { TestBed } from '@angular/core/testing';

import { AutomatedTask } from '@admin-types/automated-task/automated-task';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AutomatedTasksService } from './automated-tasks.service';

describe('AutomatedTasksService', () => {
  let service: AutomatedTasksService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutomatedTasksService],
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
      service.runTask(1).subscribe();
      const req = httpMock.expectOne('/api/admin/automated-tasks/1/run');
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });
});
