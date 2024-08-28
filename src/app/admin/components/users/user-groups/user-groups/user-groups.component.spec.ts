import { SecurityGroup, User } from '@admin-types/index';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { UserGroupsComponent } from './user-groups.component';

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
] as SecurityGroup[];

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

describe('UserGroupsComponent', () => {
  let component: UserGroupsComponent;
  let fixture: ComponentFixture<UserGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGroupsComponent],
      providers: [{ provide: UserService, useValue: { isAdmin: jest.fn().mockReturnValue(true) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserGroupsComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeHiddenSecurityGroups', () => {
    it('should remove hidden security groups', () => {
      const userGroups = [
        { role: { displayState: true } } as SecurityGroup,
        { role: { displayState: false } } as SecurityGroup,
      ];
      const result = component['removeHiddenSecurityGroups'](userGroups);
      expect(result).toEqual([{ role: { displayState: true } } as SecurityGroup]);
    });
  });

  describe('ngOnInit', () => {
    it('should call removeHiddenSecurityGroups', () => {
      const spy = jest.spyOn(component as never, 'removeHiddenSecurityGroups');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onRemoveGroups', () => {
    it('should navigate back to users screen if groups selected ', () => {
      const router = TestBed.inject(Router);
      jest.spyOn(router, 'navigate');
      const groups = [
        {
          id: 1,
          name: 'string',
          displayName: 'string',
          description: 'string',
          displayState: true,
          globalAccess: true,
          securityRoleId: 1,
          courthouseIds: [1],
          userIds: [1],
        },
      ];
      component.selectedGroups = groups;
      component.onRemoveGroups();
      expect(router.navigate).toHaveBeenCalledWith(['admin/users/', mockUser.id, 'remove-groups'], {
        state: { user: mockUser, selectedGroups: groups },
      });
    });

    it('should emit errors if no groups selected', () => {
      const router = TestBed.inject(Router);
      jest.spyOn(router, 'navigate');
      component.onRemoveGroups();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
