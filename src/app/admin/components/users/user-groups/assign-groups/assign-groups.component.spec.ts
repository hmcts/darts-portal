import { SecurityGroup, User } from '@admin-types/index';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GroupsService } from '@services/groups/groups.service';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs/internal/observable/of';
import { AssignGroupsComponent } from './assign-groups.component';
import { UserGroup } from './security-group-selector/security-group-selector.component';

const mockGroupsWithRoles: SecurityGroup[] = [
  {
    id: 1,
    name: 'Group 1',
    securityRoleId: 1,
    role: { id: 1, name: 'ROLE 1', displayState: true, displayName: 'Role 1' },
  },
  {
    id: 2,
    name: 'Group 2',
    securityRoleId: 2,
    role: { id: 2, name: 'ROLE 2', displayState: false, displayName: 'Role 2' },
  },
] as SecurityGroup[];

const mockUserGroups: UserGroup[] = mockGroupsWithRoles.map((group) => ({
  ...group,
  role: group.role?.displayName as string,
  displayState: group.role?.displayState as boolean,
}));

const mockUser: User = {
  id: 1,
  fullName: 'Test User',
  emailAddress: 'email@email.com',
  lastLoginAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
  lastModifiedAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
  createdAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
  description: 'test descrtiption',
  active: true,
  securityGroupIds: [1, 2],
  securityGroups: mockGroupsWithRoles,
};

describe('AssignGroupsComponent', () => {
  let component: AssignGroupsComponent;
  let fixture: ComponentFixture<AssignGroupsComponent>;
  let userAdminService: Partial<UserAdminService>;
  let groupsService: Partial<GroupsService>;

  beforeEach(async () => {
    userAdminService = {
      assignGroups: jest.fn().mockReturnValue(of(null)),
    };
    groupsService = {
      getGroupsAndRoles: jest.fn().mockReturnValue(of({ groups: mockGroupsWithRoles, roles: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [AssignGroupsComponent],
      providers: [
        { provide: UserAdminService, useValue: userAdminService },
        { provide: GroupsService, useValue: groupsService },
        HeaderService,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignGroupsComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get groups with roles', () => {
    expect(groupsService.getGroupsAndRoles).toHaveBeenCalled();
  });

  describe('onAssign', () => {
    it('should assign groups', () => {
      const spy = jest.spyOn(userAdminService, 'assignGroups');
      component.onAssign([mockUserGroups[0]]);
      expect(spy).toHaveBeenCalledWith(mockUser.id, [1]);
    });
  });

  describe('onCancel', () => {
    it('should navigate back to user record screen', () => {
      const spy = jest.spyOn(component.router, 'navigate');
      component.onCancel();
      expect(spy).toHaveBeenCalledWith(['/admin/users', mockUser.id], { queryParams: { tab: 'Groups' } });
    });
  });

  describe('ngOnInit', () => {
    it('should hide navigation', () => {
      const spy = jest.spyOn(component.headerService, 'hideNavigation');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should redirect if no user', () => {
      component.user = undefined as unknown as User;
      const spy = jest.spyOn(component.router, 'navigate');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(['admin', 'users']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should show navigation', () => {
      const spy = jest.spyOn(component.headerService, 'showNavigation');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('groups$', () => {
    it('should fetch security groups with roles and transform them into filtered UserGroups', fakeAsync(() => {
      const expectedUserGroups: UserGroup[] = [
        {
          id: 1,
          name: 'Group 1',
          role: 'Role 1',
          displayState: true,
        },
      ];

      let result;

      component.groups$.subscribe((groups) => {
        result = groups;
      });

      tick();

      expect(result).toEqual(expectedUserGroups);
    }));
  });
});
