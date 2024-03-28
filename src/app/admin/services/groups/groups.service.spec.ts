import { SecurityGroup, SecurityRole } from '@admin-types/index';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GET_SECURITY_GROUPS_PATH, GET_SECURITY_ROLES_PATH, GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
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
          display_name: 'Approver',
          display_state: true,
        },
        {
          id: 2,
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
          role: { id: 1, name: 'Approver', displayState: true },
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          description: 'Opus Transcribers group',
          securityRoleId: 2,
          role: { id: 2, name: 'Requestor', displayState: false },
        },
      ];

      const expectedSecurityRoles = [
        {
          id: 1,
          name: 'Approver',
          displayState: true,
        },
        {
          id: 2,
          name: 'Requestor',
          displayState: false,
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
      const mockSecurityRoles = [
        {
          id: 1,
          display_name: 'Approver',
          display_state: true,
        },
        {
          id: 2,
          display_name: 'Requestor',
          display_state: true,
        },
        {
          id: 3,
          display_name: 'Test Role',
          display_state: false,
        },
      ];

      const expectedSecurityRoles = [
        {
          id: 1,
          name: 'Approver',
          displayState: true,
        },
        {
          id: 2,
          name: 'Requestor',
          displayState: true,
        },
        {
          id: 3,
          name: 'Test Role',
          displayState: false,
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
        display_name: 'Approver',
        display_state: true,
      };

      const expectedSecurityGroup = {
        id: 1,
        name: 'Judiciary',
        description: 'Judiciary group',
        securityRoleId: 1,
        role: { id: 1, name: 'Approver', displayState: true },
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

  describe('assignCourthousesToGroup', () => {
    it('should patch the group with the courthouse ids', () => {
      const mockCourthouseIds = [1, 2, 3];

      service.assignCourthousesToGroup(1, mockCourthouseIds).subscribe();

      const req = httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}/1`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual({ courthouse_ids: mockCourthouseIds });
    });
  });
});
