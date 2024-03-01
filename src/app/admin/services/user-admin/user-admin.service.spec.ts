import { CreateUpdateUserFormValues } from '@admin-types/index';
import { UserData } from '@admin-types/users/user-data.interface';
import { UserSearchFormValues } from '@admin-types/users/user-search-form-values.type';
import { User } from '@admin-types/users/user.type';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { USER_ADMIN_PATH, USER_ADMIN_SEARCH_PATH, UserAdminService } from './user-admin.service';

export const ADMIN_GET_USER = 'api/admin/users';

describe('UserAdminService', () => {
  let service: UserAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [DatePipe] });
    service = TestBed.inject(UserAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get and map user', () => {
    it('should fetch user', () => {
      const mockUserId = 1;
      const mockUserData: UserData = {
        id: mockUserId,
        last_login_at: '2020-01-01T00:00:00Z',
        last_modified_at: '2020-01-02T00:00:00Z',
        created_at: '2020-01-01T00:00:00Z',
        full_name: 'John Doe',
        email_address: 'john@example.com',
        description: 'A test user',
        active: true,
        security_group_ids: [1, 2, 3],
      };

      service.getUser(mockUserId).subscribe();

      const req = httpMock.expectOne(`${ADMIN_GET_USER}/${mockUserId}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockUserData);
    });

    it('should correctly map UserData to User', () => {
      const userData = {
        id: '1',
        last_login_at: '2021-01-01T00:00:00.000Z',
        last_modified_at: '2021-02-01T00:00:00.000Z',
        created_at: '2021-03-01T00:00:00.000Z',
        full_name: 'John Doe',
        email_address: 'john.doe@example.com',
        description: 'A user description',
        active: true,
        security_group_ids: [1, 2, 3],
      } as unknown as UserData;

      const expectedUser = {
        id: '1',
        lastLoginAt: DateTime.fromISO(userData.last_login_at),
        lastModifiedAt: DateTime.fromISO(userData.last_modified_at),
        createdAt: DateTime.fromISO(userData.created_at),
        fullName: 'John Doe',
        emailAddress: 'john.doe@example.com',
        description: 'A user description',
        active: true,
        securityGroupIds: [1, 2, 3],
      } as unknown as User;

      const result = service['mapUser'](userData);
      expect(result).toEqual(expectedUser);
    });
  });
  describe('searchUsers', () => {
    it('should return an array of Users', () => {
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

  describe('createUser', () => {
    it('map and post a user request', fakeAsync(() => {
      const mockUserFormValues: CreateUpdateUserFormValues = {
        fullName: 'John Doe',
        email: 'test@test',
        description: 'A user description',
      };

      const expectedUserRequest = {
        full_name: 'John Doe',
        email_address: 'test@test',
        description: 'A user description',
        active: true,
        security_group_ids: [],
      };

      const mockUserData = {};

      service.createUser(mockUserFormValues).subscribe();

      const req = httpMock.expectOne(USER_ADMIN_PATH);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedUserRequest);
      req.flush(mockUserData);
    }));
  });

  describe('updateUser', () => {
    it('should send a PATCH request and map the updated user', () => {
      const mockUserId = 1;
      const mockUpdatedUser: CreateUpdateUserFormValues = {
        fullName: 'John Doe',
        email: 'test@test',
        description: 'A user description',
      };

      const expectedUserRequest = {
        full_name: mockUpdatedUser.fullName,
        email_address: mockUpdatedUser.email,
        description: mockUpdatedUser.description,
      };

      service.updateUser(mockUserId, mockUpdatedUser).subscribe();

      const req = httpMock.expectOne(`${USER_ADMIN_PATH}/${mockUserId}`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(expectedUserRequest);
      req.flush({});
    });
  });
});
