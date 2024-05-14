import { CreateUpdateUserFormValues, SecurityGroup } from '@admin-types/index';
import { UserData } from '@admin-types/users/user-data.interface';
import { UserSearchFormValues } from '@admin-types/users/user-search-form-values.type';
import { User } from '@admin-types/users/user.type';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { GroupsService } from '@services/groups/groups.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { USER_ADMIN_PATH, USER_ADMIN_SEARCH_PATH, UserAdminService } from './user-admin.service';

export const ADMIN_GET_USER = 'api/admin/users';
export const ADMIN_GET_SECURITY_GROUPS = '/api/admin/security-groups';
export const ADMIN_GET_SECURITY_ROLES = 'api/admin/security-roles';

describe('UserAdminService', () => {
  let service: UserAdminService;
  let httpMock: HttpTestingController;
  const mockSecurityGroups: SecurityGroup[] = [
    {
      id: 1,
      name: 'Judiciary',
      displayName: 'Judiciary',
      description: '',
      displayState: true,
      globalAccess: true,
      courthouseIds: [1, 2, 3],
      userIds: [1, 2, 3],
      securityRoleId: 1,
      role: {
        id: 1,
        name: 'APPROVER',
        displayState: true,
        displayName: 'Approver',
      },
    },
    {
      id: 2,
      name: 'Opus Transcribers',
      displayName: 'Opus Transcribers',
      description: '',
      displayState: true,
      globalAccess: true,
      courthouseIds: [1, 2, 3],
      userIds: [1, 2, 3],
      securityRoleId: 2,
      role: {
        id: 2,
        name: 'REQUESTOR',
        displayState: true,
        displayName: 'Requestor',
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: GroupsService,
          useValue: { getGroupsAndRoles: jest.fn().mockReturnValue(of({ groups: mockSecurityGroups, roles: [] })) },
        },
      ],
    });
    service = TestBed.inject(UserAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch and map all users', () => {
      const mockUserId = 1;
      const mockUsersData: UserData[] = [
        {
          id: mockUserId,
          last_login_at: '2020-01-01T00:00:00Z',
          last_modified_at: '2020-01-02T00:00:00Z',
          created_at: '2020-01-01T00:00:00Z',
          full_name: 'John Doe',
          email_address: 'john@example.com',
          description: 'A test user',
          active: true,
          security_group_ids: [1, 2],
        },
      ];

      const mockUserData = mockUsersData[0];

      const mappedUsers: User[] = [
        {
          id: mockUserId,
          lastLoginAt: DateTime.fromISO(mockUserData.last_login_at),
          lastModifiedAt: DateTime.fromISO(mockUserData.last_modified_at),
          createdAt: DateTime.fromISO(mockUserData.created_at),
          fullName: 'John Doe',
          emailAddress: 'john@example.com',
          description: 'A test user',
          active: true,
          securityGroupIds: [1, 2],
          securityGroups: mockSecurityGroups,
        },
      ];

      service.getUsers().subscribe((res) => {
        expect(res).toEqual(mappedUsers);
      });

      const req = httpMock.expectOne(USER_ADMIN_SEARCH_PATH);
      req.flush(mockUserData);

      expect(req.request.method).toEqual('POST');
    });
  });

  describe('getUser', () => {
    it('should fetch and map user', () => {
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
        security_group_ids: [1, 2],
      };

      const mappedUser: User = {
        id: mockUserId,
        lastLoginAt: DateTime.fromISO(mockUserData.last_login_at),
        lastModifiedAt: DateTime.fromISO(mockUserData.last_modified_at),
        createdAt: DateTime.fromISO(mockUserData.created_at),
        fullName: 'John Doe',
        emailAddress: 'john@example.com',
        description: 'A test user',
        active: true,
        securityGroupIds: [1, 2],
        securityGroups: mockSecurityGroups,
      };

      let result!: User;

      service.getUser(mockUserId).subscribe((res) => (result = res));

      httpMock.expectOne(`${ADMIN_GET_USER}/${mockUserId}`).flush(mockUserData);

      expect(result).toEqual(mappedUser);
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

  describe('assignGroups', () => {
    it('should send a PATCH request and map the updated user', () => {
      const mockUserId = 1;
      const mockUpdatedGroups: number[] = [1, 2, 3];

      const expectedUserRequest = {
        security_group_ids: mockUpdatedGroups,
      };

      service.assignGroups(mockUserId, mockUpdatedGroups).subscribe();

      const req = httpMock.expectOne(`${USER_ADMIN_PATH}/${mockUserId}`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(expectedUserRequest);
      req.flush({});
    });
  });

  describe('doesEmailExist', () => {
    it('Returns true if it does', fakeAsync(() => {
      const mockUserData = {};
      let result;

      service.doesEmailExist('test@email.com').subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne(USER_ADMIN_PATH);
      expect(req.request.method).toEqual('GET');
      req.flush(mockUserData);
      expect(result).toBe(false);
    }));
  });

  describe('activateUser', () => {
    it('should send a PATCH request and map the updated user', () => {
      const mockUserId = 1;

      service.activateUser(mockUserId).subscribe();

      const req = httpMock.expectOne(`${USER_ADMIN_PATH}/${mockUserId}`);
      expect(req.request.method).toEqual('PATCH');
      req.flush({});
    });
  });

  describe('private method - mapToCreateUserRequest', () => {
    it('should map user creation request', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).mapToCreateUserRequest({
          fullName: 'FULLNAME',
          email: 'EMAIL',
        })
      ).toEqual({
        full_name: 'FULLNAME',
        email_address: 'EMAIL',
        description: null,
        active: true,
        security_group_ids: [],
      });
    });
  });

  describe('private method - mapToUserSearchRequest', () => {
    it('should map user creation request', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).mapToUserSearchRequest({
          fullName: 'FULLNAME',
          email: 'EMAIL',
          userStatus: 'active',
        })
      ).toEqual({
        full_name: 'FULLNAME',
        email_address: 'EMAIL',
        active: true,
      });
    });

    it('should return null for values not provided', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).mapToUserSearchRequest({})
      ).toEqual({
        full_name: null,
        email_address: null,
        active: null,
      });
    });

    it('should return active as false if "inactive" provided as userStatus value', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).mapToUserSearchRequest({
          userStatus: 'inactive',
        })
      ).toEqual({
        full_name: null,
        email_address: null,
        active: false,
      });
    });
  });

  describe('getUsersById', () => {
    it('should fetch and map all users', () => {
      const mockUserId = 1;
      const mockUsersData: UserData[] = [
        {
          id: mockUserId,
          last_login_at: '2020-01-01T00:00:00Z',
          last_modified_at: '2020-01-02T00:00:00Z',
          created_at: '2020-01-01T00:00:00Z',
          full_name: 'John Doe',
          email_address: 'email@email.com',
          description: 'A test user',
          active: true,
          security_group_ids: [1, 2],
        },
      ];
      const mockUserData = mockUsersData[0];
      const mappedUsers: User[] = [
        {
          id: mockUserId,
          lastLoginAt: DateTime.fromISO(mockUserData.last_login_at),
          lastModifiedAt: DateTime.fromISO(mockUserData.last_modified_at),
          createdAt: DateTime.fromISO(mockUserData.created_at),
          fullName: 'John Doe',
          emailAddress: 'email@email.com',
          description: 'A test user',
          active: true,
          securityGroupIds: [1, 2],
        },
      ];

      let result = [] as User[];
      service.getUsersById([mockUserId]).subscribe((res: User[]) => (result = res));

      const req = httpMock.expectOne('api/admin/users?user_ids=1');
      req.flush(mockUsersData);

      expect(result).toEqual(mappedUsers);
    });
  });

  describe('deactivateUser', () => {
    it('should send a PATCH request and map the rolled back transcript requests', () => {
      const mockUserId = 1;
      const mockRolledBackTranscriptRequests = [1, 2, 3];
      let result = [] as number[];

      service.deactivateUser(mockUserId).subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${USER_ADMIN_PATH}/${mockUserId}`);
      expect(req.request.method).toEqual('PATCH');
      req.flush({ rolled_back_transcript_requests: mockRolledBackTranscriptRequests });

      expect(result).toEqual(mockRolledBackTranscriptRequests);
    });
  });
});
