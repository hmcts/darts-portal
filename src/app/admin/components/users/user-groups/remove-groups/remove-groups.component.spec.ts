import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroup, User } from '@admin-types/index';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { RemoveGroupsComponent } from './remove-groups.component';

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

describe('RemoveGroupsComponent', () => {
  let component: RemoveGroupsComponent;
  let fixture: ComponentFixture<RemoveGroupsComponent>;
  let fakeUserAdminService: Partial<UserAdminService>;

  beforeEach(async () => {
    fakeUserAdminService = {
      assignGroups: jest.fn().mockReturnValue(of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [RemoveGroupsComponent],
      providers: [{ provide: UserAdminService, useValue: fakeUserAdminService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveGroupsComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.selectedGroups = mockGroupsWithRoles;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeGroups', () => {
    it('should remove the selected groups', () => {
      component.selectedGroups = [mockGroupsWithRoles[0]];

      component.removeGroups();

      expect(fakeUserAdminService.assignGroups).toHaveBeenCalledWith(mockUser.id, [2]);
    });

    it('should navigate to the user page', () => {
      component.selectedGroups = [mockGroupsWithRoles[0]];

      component.removeGroups();

      expect(fakeUserAdminService.assignGroups).toHaveBeenCalledWith(mockUser.id, [2]);
    });
  });
});
