import { TestBed } from '@angular/core/testing';

import { UserData } from '@admin-types/users/user-data.interface';
import { User } from '@admin-types/users/user.type';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DateTime } from 'luxon';
import { UserAdminService } from './user-admin.service';

export const ADMIN_GET_USER = 'api/admin/users';

describe('UserAdminService', () => {
  let service: UserAdminService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatePipe],
    });
    service = TestBed.inject(UserAdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
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

      const req = httpTestingController.expectOne(`${ADMIN_GET_USER}/${mockUserId}`);
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

      const result = service.mapUser(userData);
      expect(result).toEqual(expectedUser);
    });
  });
});
