import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { SecurityGroup, SecurityRole, User } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { CourthouseRecordComponent } from './courthouse-record.component';

describe('CourthouseRecordComponent', () => {
  let component: CourthouseRecordComponent;
  let fixture: ComponentFixture<CourthouseRecordComponent>;
  let fakeCourthouseAdminService: Partial<CourthouseService>;
  let fakeGroupsService: Partial<GroupsService>;
  let fakeUsersService: Partial<UserAdminService>;
  let fakeActivatedRoute: ActivatedRoute;

  const TEST_COURTHOUSE: Courthouse = {
    id: 123,
    code: 1,
    courthouseName: 'COURTHOUSE',
    displayName: 'Courthouse',
    createdDateTime: DateTime.fromISO('2024-01-01'),
    lastModifiedDateTime: DateTime.fromISO('2024-01-01'),
    region: { name: 'Region' },
  };

  const mockRoles: SecurityRole[] = [
    {
      id: 1,
      name: 'APPROVER',
      displayState: true,
      displayName: 'Approver',
    },
    {
      id: 2,
      name: 'REQUESTER',
      displayState: true,
      displayName: 'Requestor',
    },
    {
      id: 3,
      name: 'JUDGE',
      displayState: true,
      displayName: 'Judge',
    },
    {
      id: 4,
      name: 'TRANSCRIBER',
      displayState: true,
      displayName: 'Transcriber',
    },
    {
      id: 5,
      name: 'TRANSLATION_QA',
      displayState: true,
      displayName: 'Translation QA',
    },
    {
      id: 6,
      name: 'RCJ APPEALS',
      displayState: true,
      displayName: 'RCJ Appeals',
    },
    {
      id: 7,
      name: 'ADMIN',
      displayState: true,
      displayName: 'Admin',
    },
    {
      id: 8,
      name: 'DONT DISPLAY ROLE',
      displayState: false,
      displayName: 'Dont Display Role',
    },
  ];

  const mockRequesterApproverGroups: SecurityGroup[] = [
    {
      id: 1,
      securityRoleId: 1,
      name: 'Judiciary',
      displayName: 'Judiciary',
      displayState: true,
      globalAccess: true,
      courthouseIds: [0],
      userIds: [1],
      description: 'Dummy description 1',
    },
    {
      id: 2,
      securityRoleId: 2,
      name: 'Opus Transcribers',
      displayName: 'Opus Transcribers',
      displayState: true,
      globalAccess: true,
      courthouseIds: [0],
      userIds: [1, 2],
      description: 'Dummy description 2',
    },
  ];

  const mockUsers = [
    {
      id: 1,
      lastLoginAt: '2023-12-11T00:00:00.000Z',
      lastModifiedAt: '2020-01-21T00:00:00.000Z',
      createdAt: '2020-01-11T00:00:00.000Z',
      fullName: 'Eric Bristow',
      emailAddress: 'eric.bristow@darts.local',
      description: 'Stub Active User',
      active: true,
      securityGroupIds: [1],
    },
    {
      id: 2,
      lastLoginAt: '2023-12-21T00:00:00.000Z',
      lastModifiedAt: '2020-01-31T00:00:00.000Z',
      createdAt: '2020-01-21T00:00:00.000Z',
      fullName: 'Fallon Sherrock',
      emailAddress: 'fallon.sherrock@darts.local',
      description: 'Stub Active User',
      active: true,
      securityGroupIds: [1, 2],
    },
  ];

  beforeEach(async () => {
    fakeCourthouseAdminService = {
      getCourthouseWithRegionsAndSecurityGroups: jest.fn().mockReturnValue(of(TEST_COURTHOUSE)),
    };
    fakeGroupsService = {
      getRoles: jest.fn().mockReturnValue(of(mockRoles)),
      getGroupsByRoleIdsAndCourthouseId: jest.fn().mockReturnValue(of(mockRequesterApproverGroups)),
    };
    fakeUsersService = {
      getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
    };
    fakeActivatedRoute = {
      snapshot: {
        params: {
          courthouseId: 123,
        },
        queryParams: {
          newCourthouse: true,
        },
      },
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [CourthouseRecordComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {
          provide: CourthouseService,
          useValue: fakeCourthouseAdminService,
        },
        {
          provide: GroupsService,
          useValue: fakeGroupsService,
        },
        {
          provide: UserAdminService,
          useValue: fakeUsersService,
        },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format security groups to string', () => {
    const groups: SecurityGroup[] = [
      { id: 1, securityRoleId: 1, name: 'Group 1' },
      { id: 2, securityRoleId: 2, name: 'Group 2' },
    ] as SecurityGroup[];
    expect(component.formatSecurityGroupLinks(groups)).toStrictEqual([
      { value: 'Group 1', href: '/admin/groups/1' },
      { value: 'Group 2', href: '/admin/groups/2' },
    ]);
  });

  describe('roles$', () => {
    it('should call getRoles() and return an array of Roles with approver and requester ids', () => {
      const expectedRoles = {
        roles: [
          {
            id: 1,
            name: 'APPROVER',
            displayState: true,
            displayName: 'Approver',
          },
          {
            id: 2,
            name: 'REQUESTER',
            displayState: true,
            displayName: 'Requestor',
          },
          {
            id: 3,
            name: 'JUDGE',
            displayState: true,
            displayName: 'Judge',
          },
          {
            id: 4,
            name: 'TRANSCRIBER',
            displayState: true,
            displayName: 'Transcriber',
          },
          {
            id: 5,
            name: 'TRANSLATION_QA',
            displayState: true,
            displayName: 'Translation QA',
          },
          {
            id: 6,
            name: 'RCJ APPEALS',
            displayState: true,
            displayName: 'RCJ Appeals',
          },
          {
            id: 7,
            name: 'ADMIN',
            displayState: true,
            displayName: 'Admin',
          },
          {
            id: 8,
            name: 'DONT DISPLAY ROLE',
            displayState: false,
            displayName: 'Dont Display Role',
          },
        ],
        requesterId: 2,
        approverId: 1,
      };

      let result;

      component.roles$.subscribe((rolesArray) => {
        result = rolesArray;
      });

      expect(fakeGroupsService.getRoles).toHaveBeenCalled();
      expect(result).toEqual(expectedRoles);
    });
  });

  describe('courthouseRequesterApproverGroups$', () => {
    it('should return an object containing roles, requesterId, approverId, groups, approverUserIds, requesterUserIds, groupId and userId', () => {
      const expectedResult = {
        roles: [
          {
            id: 1,
            name: 'APPROVER',
            displayState: true,
            displayName: 'Approver',
          },
          {
            id: 2,
            name: 'REQUESTER',
            displayState: true,
            displayName: 'Requestor',
          },
          {
            id: 3,
            name: 'JUDGE',
            displayState: true,
            displayName: 'Judge',
          },
          {
            id: 4,
            name: 'TRANSCRIBER',
            displayState: true,
            displayName: 'Transcriber',
          },
          {
            id: 5,
            name: 'TRANSLATION_QA',
            displayState: true,
            displayName: 'Translation QA',
          },
          {
            id: 6,
            name: 'RCJ APPEALS',
            displayState: true,
            displayName: 'RCJ Appeals',
          },
          {
            id: 7,
            name: 'ADMIN',
            displayState: true,
            displayName: 'Admin',
          },
          {
            id: 8,
            name: 'DONT DISPLAY ROLE',
            displayState: false,
            displayName: 'Dont Display Role',
          },
        ],
        requesterId: 2,
        approverId: 1,
        groups: [
          {
            id: 1,
            name: 'Judiciary',
            displayName: 'Judiciary',
            description: 'Dummy description 1',
            displayState: true,
            globalAccess: true,
            securityRoleId: 1,
            courthouseIds: [0],
            userIds: [1],
          },
          {
            id: 2,
            name: 'Opus Transcribers',
            displayName: 'Opus Transcribers',
            description: 'Dummy description 2',
            displayState: true,
            globalAccess: true,
            securityRoleId: 2,
            courthouseIds: [0],
            userIds: [1, 2],
          },
        ],
        approverUserIds: [1],
        requesterUserIds: [1, 2],
      };

      let result;
      component.courthouseRequesterApproverGroups$.subscribe((returnArr) => {
        result = returnArr;
      });

      // params in call are [requesterId, approverId] and courthouseId
      expect(fakeGroupsService.getGroupsByRoleIdsAndCourthouseId).toHaveBeenCalledWith([2, 1], 123);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('users$', () => {
    it('should return an array of users with their username, email address and role type where they are a requester or approver in the courthouse', () => {
      const expectedResult = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          groupId: 1,
          userId: 1,
        },
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Requestor',
          groupId: 2,
          userId: 1,
        },
        {
          userName: 'Fallon Sherrock',
          email: 'fallon.sherrock@darts.local',
          roleType: 'Requestor',
          groupId: 2,
          userId: 2,
        },
      ];

      let result;
      component.users$.subscribe((users) => {
        result = users;
      });

      // params in call are user ids of users with requester and approver permissions
      expect(fakeUsersService.getUsersById).toHaveBeenCalledWith([1, 1, 2]);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUsersWithRoleByGroup', () => {
    it('should return users with approver permissions', () => {
      const pUsers: User[] = [
        {
          id: 1,
          lastLoginAt: DateTime.fromISO('2023-12-11T00:00:00.000Z'),
          lastModifiedAt: DateTime.fromISO('2020-01-21T00:00:00.000Z'),
          createdAt: DateTime.fromISO('2020-01-11T00:00:00.000Z'),
          fullName: 'Eric Bristow',
          emailAddress: 'eric.bristow@darts.local',
          description: 'Stub Active User',
          active: true,
          securityGroupIds: [1],
        },
        {
          id: 2,
          lastLoginAt: DateTime.fromISO('2023-12-21T00:00:00.000Z'),
          lastModifiedAt: DateTime.fromISO('2020-01-31T00:00:00.000Z'),
          createdAt: DateTime.fromISO('2020-01-21T00:00:00.000Z'),
          fullName: 'Fallon Sherrock',
          emailAddress: 'fallon.sherrock@darts.local',
          description: 'Stub Active User',
          active: true,
          securityGroupIds: [1, 2],
        },
      ];
      const pGroupUserIds: number[] = [1];
      const pGroups: SecurityGroup[] = [
        {
          id: 1,
          name: 'Judiciary',
          displayName: 'Judiciary',
          description: 'Dummy description 1',
          displayState: true,
          globalAccess: true,
          securityRoleId: 1,
          courthouseIds: [0],
          userIds: [1],
        },
        {
          id: 2,
          name: 'Opus Transcribers',
          displayName: 'Opus Transcribers',
          description: 'Dummy description 2',
          displayState: true,
          globalAccess: true,
          securityRoleId: 2,
          courthouseIds: [0],
          userIds: [1, 2],
        },
      ];
      // role Id for Approver
      const pRoleId: number = 1;
      const pRoles: SecurityRole[] = [
        {
          id: 1,
          name: 'APPROVER',
          displayState: true,
          displayName: 'Approver',
        },
        {
          id: 2,
          name: 'REQUESTER',
          displayState: true,
          displayName: 'Requestor',
        },
        {
          id: 3,
          name: 'JUDGE',
          displayState: true,
          displayName: 'Judge',
        },
        {
          id: 4,
          name: 'TRANSCRIBER',
          displayState: true,
          displayName: 'Transcriber',
        },
        {
          id: 5,
          name: 'TRANSLATION_QA',
          displayState: true,
          displayName: 'Translation QA',
        },
        {
          id: 6,
          name: 'RCJ APPEALS',
          displayState: true,
          displayName: 'RCJ Appeals',
        },
        {
          id: 7,
          name: 'ADMIN',
          displayState: true,
          displayName: 'Admin',
        },
        {
          id: 8,
          name: 'DONT DISPLAY ROLE',
          displayState: false,
          displayName: 'Dont Display Role',
        },
      ];

      const results = component.getUsersWithRoleByGroup(pUsers, pGroupUserIds, pGroups, pRoleId, pRoles);
      const expectedResult = [
        {
          id: 1,
          lastLoginAt: DateTime.fromISO('2023-12-11T00:00:00.000Z'),
          lastModifiedAt: DateTime.fromISO('2020-01-21T00:00:00.000Z'),
          createdAt: DateTime.fromISO('2020-01-11T00:00:00.000Z'),
          fullName: 'Eric Bristow',
          groupId: 1,
          emailAddress: 'eric.bristow@darts.local',
          description: 'Stub Active User',
          active: true,
          securityGroupIds: [1],
          role: 'Approver',
        },
      ];
      expect(results).toEqual(expectedResult);
    });
  });
});
