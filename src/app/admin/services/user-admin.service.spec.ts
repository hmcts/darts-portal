import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserData } from '../models/users/user-data.interface';
import { UserSearchFormValues } from '../models/users/user-search-form-values.type';
import { USER_ADMIN_SEARCH_PATH, UserAdminService } from './user-admin.service';

describe('UserAdminService', () => {
  let service: UserAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UserAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call searchUsers and return an array of Users', () => {
    const mockQuery: UserSearchFormValues = {
      fullName: 'User',
    };
    const mockResponse = [
      {
        id: 1,
        last_modified_at: '2024-01-20T00:00:00.000000Z',
        created_at: '2024-01-20T00:00:00.000000Z',
        full_name: 'Darts User',
        email_address: 'user@local.net',
        active: true,
        security_group_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        id: 2,
        last_modified_at: '2023-01-20T00:00:00.000000Z',
        created_at: '2023-01-20T00:00:00.000000Z',
        full_name: 'Dev User',
        email_address: 'dev@local.net',
        active: true,
        security_group_ids: [1, 2, 3],
      },
    ] as UserData[];

    service.searchUsers(mockQuery).subscribe((users) => {
      expect(users).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(USER_ADMIN_SEARCH_PATH);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse); // Simulate a response
  });
});
