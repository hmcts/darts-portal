import { SecurityGroup, User } from '@admin-types/index';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
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
    role: { id: 1, name: 'Role 1', displayState: true },
  },
  {
    id: 2,
    name: 'Group 2',
    securityRoleId: 2,
    role: { id: 2, name: 'Role 2', displayState: false },
  },
];

const mockUserGroups: UserGroup[] = mockGroupsWithRoles.map((group) => ({
  ...group,
  role: group.role?.name as string,
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

  beforeEach(async () => {
    userAdminService = {
      getSecurityGroupsWithRoles: jest.fn().mockReturnValue(of(mockGroupsWithRoles)),
      assignGroups: jest.fn().mockReturnValue(of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [AssignGroupsComponent, RouterTestingModule],
      providers: [{ provide: UserAdminService, useValue: userAdminService }, HeaderService],
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
    expect(userAdminService.getSecurityGroupsWithRoles).toHaveBeenCalled();
  });

  describe('onAssign', () => {
    it('should assign groups', () => {
      const spy = jest.spyOn(userAdminService, 'assignGroups');
      component.onAssign([mockUserGroups[0]], [mockUserGroups[1]]);
      expect(spy).toHaveBeenCalledWith(mockUser.id, [1, 2]);
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
    it('should fetch security groups with roles and transform them into UserGroups', fakeAsync(() => {
      const mockGroups: SecurityGroup[] = [
        {
          id: 1,
          name: 'Group 1',
          securityRoleId: 1,
          role: { id: 1, name: 'Role 1', displayState: true },
        },
        {
          id: 2,
          name: 'Group 2',
          securityRoleId: 2,
          role: { id: 2, name: 'Role 2', displayState: false },
        },
      ];

      const expectedUserGroups: UserGroup[] = [
        {
          id: 1,
          name: 'Group 1',
          role: 'Role 1',
          displayState: true,
        },
        {
          id: 2,
          name: 'Group 2',
          role: 'Role 2',
          displayState: false,
        },
      ];

      // Mock the getSecurityGroupsWithRoles method to return the mockGroups
      jest.spyOn(userAdminService, 'getSecurityGroupsWithRoles').mockReturnValue(of(mockGroups));

      let result;

      // Subscribe to the groups$ observable and check the emitted value
      component.groups$.subscribe((groups) => {
        result = groups;
      });

      tick();

      expect(result).toEqual(expectedUserGroups);
    }));

    it('should share the replay of the groups$', () => {
      const mockGroups: SecurityGroup[] = [
        {
          id: 1,
          name: 'Group 1',
          securityRoleId: 1,
          role: { id: 1, name: 'Role 1', displayState: true },
        },
        {
          id: 2,
          name: 'Group 2',
          securityRoleId: 2,
          role: { id: 2, name: 'Role 2', displayState: false },
        },
      ];

      // Mock the getSecurityGroupsWithRoles method to return the mockGroups
      jest.spyOn(userAdminService, 'getSecurityGroupsWithRoles').mockReturnValue(of(mockGroups));

      // Subscribe to the groups$ observable twice
      component.groups$.subscribe();
      component.groups$.subscribe();

      // Check that the getSecurityGroupsWithRoles method is only called once
      expect(userAdminService.getSecurityGroupsWithRoles).toHaveBeenCalledTimes(1);
    });
  });
});
