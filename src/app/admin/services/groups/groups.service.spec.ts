import { GroupFormValue, SecurityGroup, SecurityRole, SecurityRoleData } from '@admin-types/index';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GET_SECURITY_GROUPS_PATH, GET_SECURITY_ROLES_PATH, GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [], providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(GroupsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getGroupsAndRoles', () => {
    it('should return an object with groups and roles', () => {
      const mockSecurityGroups = [
        {
          id: 1,
          name: 'Judiciary',
          description: 'Judiciary group',
          security_role_id: 1,
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          description: 'Opus Transcribers group',
          security_role_id: 2,
        },
      ];

      const mockSecurityRoles = [
        {
          id: 1,
          role_name: 'APPROVER',
          display_name: 'Approver',
          display_state: true,
        },
        {
          id: 2,
          role_name: 'REQUESTOR',
          display_name: 'Requestor',
          display_state: false,
        },
      ];

      const expectedSecurityGroups = [
        {
          id: 1,
          name: 'Judiciary',
          description: 'Judiciary group',
          securityRoleId: 1,
          role: { id: 1, name: 'APPROVER', displayState: true, displayName: 'Approver' },
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          description: 'Opus Transcribers group',
          securityRoleId: 2,
          role: { id: 2, name: 'REQUESTOR', displayState: false, displayName: 'Requestor' },
        },
      ];

      const expectedSecurityRoles = [
        {
          id: 1,
          name: 'APPROVER',
          displayState: true,
          displayName: 'Approver',
        },
        {
          id: 2,
          name: 'REQUESTOR',
          displayState: false,
          displayName: 'Requestor',
        },
      ];

      let result!: { groups: SecurityGroup[]; roles: SecurityRole[] };

      service.getGroupsAndRoles().subscribe((security) => {
        result = security;
      });

      const groupsReq = httpMock.expectOne(GET_SECURITY_GROUPS_PATH);
      expect(groupsReq.request.method).toEqual('GET');
      groupsReq.flush(mockSecurityGroups);

      const rolesReq = httpMock.expectOne(GET_SECURITY_ROLES_PATH);
      expect(rolesReq.request.method).toEqual('GET');
      rolesReq.flush(mockSecurityRoles);

      expect(result.groups).toEqual(expectedSecurityGroups);
      expect(result.roles).toEqual(expectedSecurityRoles);
    });
  });

  describe('getGroups', () => {
    it('should return an array of mapped SecurityGroups', () => {
      const mockSecurityGroups = [
        {
          id: 1,
          name: 'Judiciary',
          description: 'Judiciary group',
          security_role_id: 1,
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          description: 'Opus Transcribers group',
          security_role_id: 2,
        },
      ];

      const expectedSecurityGroups = [
        {
          id: 1,
          name: 'Judiciary',
          description: 'Judiciary group',
          securityRoleId: 1,
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          description: 'Opus Transcribers group',
          securityRoleId: 2,
        },
      ];

      let result;

      service.getGroups().subscribe((groups) => {
        result = groups;
      });

      const req = httpMock.expectOne(GET_SECURITY_GROUPS_PATH);
      expect(req.request.method).toEqual('GET');
      req.flush(mockSecurityGroups);

      expect(result).toEqual(expectedSecurityGroups);
    });
  });

  describe('getRoles', () => {
    it('should return an array of mapped SecurityRoles', () => {
      const mockSecurityRoles: SecurityRoleData[] = [
        {
          id: 1,
          role_name: 'APPROVER',
          display_name: 'Approver',
          display_state: true,
        },
        {
          id: 2,
          role_name: 'REQUESTOR',
          display_name: 'Requestor',
          display_state: true,
        },
        {
          id: 3,
          role_name: 'TEST_ROLE',
          display_name: 'Test Role',
          display_state: false,
        },
      ];

      const expectedSecurityRoles = [
        {
          id: 1,
          name: 'APPROVER',
          displayState: true,
          displayName: 'Approver',
        },
        {
          id: 2,
          name: 'REQUESTOR',
          displayState: true,
          displayName: 'Requestor',
        },
        {
          id: 3,
          name: 'TEST_ROLE',
          displayState: false,
          displayName: 'Test Role',
        },
      ];

      let result;

      service.getRoles().subscribe((roles) => {
        result = roles;
      });

      const req = httpMock.expectOne(GET_SECURITY_ROLES_PATH);
      expect(req.request.method).toEqual('GET');
      req.flush(mockSecurityRoles);

      expect(result).toEqual(expectedSecurityRoles);
    });
  });

  describe('getGroup', () => {
    it('should return a mapped SecurityGroup', () => {
      const mockSecurityGroup = {
        id: 1,
        name: 'Judiciary',
        description: 'Judiciary group',
        security_role_id: 1,
      };

      const expectedSecurityGroup = {
        id: 1,
        name: 'Judiciary',
        description: 'Judiciary group',
        securityRoleId: 1,
      };

      let result;

      service.getGroup(1).subscribe((group) => {
        result = group;
      });

      const req = httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}/1`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockSecurityGroup);

      expect(result).toEqual(expectedSecurityGroup);
    });
  });

  describe('getGroupAndRole', () => {
    it('should return a mapped SecurityGroup with a mapped SecurityRole', () => {
      const mockSecurityGroup = {
        id: 1,
        name: 'Judiciary',
        description: 'Judiciary group',
        security_role_id: 1,
      };

      const mockSecurityRole = {
        id: 1,
        role_name: 'APPROVER',
        display_name: 'Approver',
        display_state: true,
      };

      const expectedSecurityGroup = {
        id: 1,
        name: 'Judiciary',
        description: 'Judiciary group',
        securityRoleId: 1,
        role: { id: 1, name: 'APPROVER', displayState: true, displayName: 'Approver' },
      };

      let result;

      service.getGroupAndRole(1).subscribe((group) => {
        result = group;
      });

      const groupReq = httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}/1`);
      expect(groupReq.request.method).toEqual('GET');
      groupReq.flush(mockSecurityGroup);

      const rolesReq = httpMock.expectOne(GET_SECURITY_ROLES_PATH);
      expect(rolesReq.request.method).toEqual('GET');
      rolesReq.flush([mockSecurityRole]);

      expect(result).toEqual(expectedSecurityGroup);
    });
  });

  describe('assignUsersToGroup', () => {
    it('should call security groups patch path', () => {
      service.assignUsersToGroup(1, [1, 2, 3]).subscribe();

      const req = httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}/1`);
      expect(req.request.method).toEqual('PATCH');
    });
  });

  describe('updateGroup', () => {
    it('should call security groups patch path', () => {
      service.updateGroup(1, { name: null, description: null, role: null }).subscribe();

      const req = httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}/1`);
      expect(req.request.method).toEqual('PATCH');
    });
  });

  describe('assignCourthousesToGroup', () => {
    it('should patch the group with the courthouse ids', () => {
      const mockCourthouseIds = [1, 2, 3];

      service.assignCourthousesToGroup(1, mockCourthouseIds).subscribe();

      const req = httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}/1`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual({ courthouse_ids: mockCourthouseIds });
    });
  });

  describe('createGroup', () => {
    it('should call endpoint with group form values', () => {
      const mockGroupFormValues: GroupFormValue = {
        name: 'Judiciary',
        description: 'Judiciary group',
        role: { id: 1 } as SecurityRole,
      };

      const expectedGroupRequest = {
        name: 'Judiciary',
        display_name: 'Judiciary',
        description: 'Judiciary group',
        security_role_id: 1,
      };

      const mockSecurityGroup = {
        id: 1,
        name: 'Judiciary',
        description: 'Judiciary group',
        security_role_id: 1,
      };

      service.createGroup(mockGroupFormValues).subscribe();

      const req = httpMock.expectOne(GET_SECURITY_GROUPS_PATH);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedGroupRequest);
      req.flush(mockSecurityGroup);
    });
  });

  describe('getGroupsAndRoles', () => {
    it('should get security groups with role ids and a courthouse id', () => {
      const roleIds = [1, 2];
      const courthouseId = 16;

      const mockExpectedGroups = [
        {
          id: 12,
          security_role_id: 1,
          name: 'Oxford Requesters',
          display_name: 'Oxford Requesters',
          display_state: true,
          global_access: true,
          courthouse_ids: [16],
          user_ids: [1, 3],
          description: 'Dummy description 1',
        },
        {
          id: 13,
          security_role_id: 2,
          name: 'Oxford Approvers',
          display_name: 'Oxford Approvers',
          display_state: true,
          global_access: true,
          courthouse_ids: [16],
          user_ids: [2, 3],
          description: 'Dummy description 2',
        },
      ];

      const expectedGroups = [
        {
          id: 12,
          securityRoleId: 1,
          name: 'Oxford Requesters',
          displayName: 'Oxford Requesters',
          displayState: true,
          globalAccess: true,
          courthouseIds: [16],
          userIds: [1, 3],
          description: 'Dummy description 1',
        },
        {
          id: 13,
          securityRoleId: 2,
          name: 'Oxford Approvers',
          displayName: 'Oxford Approvers',
          displayState: true,
          globalAccess: true,
          courthouseIds: [16],
          userIds: [2, 3],
          description: 'Dummy description 2',
        },
      ];

      let result;

      service.getGroupsByRoleIdsAndCourthouseId(roleIds, courthouseId).subscribe((groups) => {
        result = groups;
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${GET_SECURITY_GROUPS_PATH}?role_ids=1&role_ids=2&courthouse_id=16`,
      });
      req.flush(mockExpectedGroups);

      expect(result).toEqual(expectedGroups);
    });
  });

  describe('getGroupsWhereUserIsTheOnlyMember', () => {
    it('should return an array of mapped SecurityGroups', () => {
      const mockSecurityGroups = [
        {
          id: 1,
          name: 'Judiciary',
          description: 'Judiciary group',
          security_role_id: 1,
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          description: 'Opus Transcribers group',
          security_role_id: 2,
        },
      ];

      const expectedSecurityGroups = [
        {
          id: 1,
          name: 'Judiciary',
          description: 'Judiciary group',
          securityRoleId: 1,
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          description: 'Opus Transcribers group',
          securityRoleId: 2,
        },
      ];

      let result;

      service.getGroupsWhereUserIsTheOnlyMember(1).subscribe((groups) => {
        result = groups;
      });

      const req = httpMock.expectOne({
        url: `${GET_SECURITY_GROUPS_PATH}?user_id=1&singleton_user=true`,
        method: 'GET',
      });

      req.flush(mockSecurityGroups);

      expect(result).toEqual(expectedSecurityGroups);
    });
  });
});
