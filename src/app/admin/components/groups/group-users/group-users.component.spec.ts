import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { GroupUsersComponent, addCheckboxLabelToUsers } from './group-users.component';

describe('GroupUsersComponent', () => {
  let component: GroupUsersComponent;
  let fixture: ComponentFixture<GroupUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('autoCompleteUsers should not contain users already in the group', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: 'test@aol.com' } as User;
      const user2 = { id: 2, fullName: 'user 2', emailAddress: 'test@msn.com' } as User;
      component.allUsers = [user1, user2];
      component.groupUsers = [user1];

      component.ngOnInit();

      expect(component.autoCompleteUsers).toEqual([{ id: 2, name: 'user 2 (test@msn.com)' }]);
    });
  });

  describe('#onUserSelect', () => {
    it('should set userToAdd to selected user', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: 'test@aol.com' } as User;
      component.allUsers = [user1];
      component.groupUsers = [];

      component.onUserSelect({ id: 1, name: 'user 1 (test@aol.com)' });

      expect(component.userToAdd).toEqual(user1);
    });

    it('should set invalidUserSubmitted to true if userToAdd is null', () => {
      component.allUsers = [];
      component.groupUsers = [];

      component.onUserSelect(null);

      expect(component.invalidUserSubmitted).toBeTruthy();
    });
  });

  describe('#onAddUserToCourthouse', () => {
    it('should add user to groupUsers', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: '' } as User;
      component.userToAdd = user1;
      component.groupUsers = [];
      component.autoCompleteUsers = [{ id: 1, name: 'user 1' }];

      component.onAddUserToCourthouse();

      expect(component.groupUsers).toEqual([user1]);
    });

    it('should remove user from autoCompleteUsers', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: '' } as User;
      component.userToAdd = user1;
      component.groupUsers = [];
      component.autoCompleteUsers = [{ id: 1, name: 'user 1' }];

      component.onAddUserToCourthouse();

      expect(component.autoCompleteUsers).toEqual([]);
    });

    it('should emit updated groupUsers', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: '' } as User;
      component.userToAdd = user1;
      component.groupUsers = [];
      component.autoCompleteUsers = [{ id: 1, name: 'user 1' }];
      jest.spyOn(component.update, 'emit');

      component.onAddUserToCourthouse();

      expect(component.update.emit).toHaveBeenCalledWith([1]);
    });

    it('should set userToAdd to null', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: '' } as User;
      component.userToAdd = user1;
      component.groupUsers = [];
      component.autoCompleteUsers = [{ id: 1, name: 'user 1' }];

      component.onAddUserToCourthouse();

      expect(component.userToAdd).toBeNull();
    });

    it('should set invalidUserSubmitted to true if userToAdd is null', () => {
      component.userToAdd = null;
      component.groupUsers = [];
      component.autoCompleteUsers = [{ id: 1, name: 'user 1' }];

      component.onAddUserToCourthouse();

      expect(component.invalidUserSubmitted).toBeTruthy();
    });
  });

  describe('#onRemoveUsersButtonClicked', () => {
    it('should remove all users from group', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: '' } as User;
      const user2 = { id: 2, fullName: 'user 2', emailAddress: '' } as User;
      component.groupUsers = [user1, user2];
      jest.spyOn(component.remove, 'emit');

      component.onRemoveUsersButtonClicked();

      expect(component.remove.emit).toHaveBeenCalledWith({ groupUsers: [user1, user2], userIdsToRemove: [1, 2] });
    });

    it('should remove selected users from group', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: '' } as User;
      const user2 = { id: 2, fullName: 'user 2', emailAddress: '' } as User;
      component.groupUsers = [user1, user2];
      component.usersToRemove = [user1];
      jest.spyOn(component.remove, 'emit');

      component.onRemoveUsersButtonClicked();

      expect(component.remove.emit).toHaveBeenCalledWith({ groupUsers: [user1, user2], userIdsToRemove: [1] });
    });
  });

  describe('addCheckboxLabelToUsers', () => {
    it('should add checkboxLabel to user', () => {
      const user1 = { id: 1, fullName: 'user 1', emailAddress: '' } as User;
      const user2 = { id: 2, fullName: 'user 2', emailAddress: '' } as User;
      const users = [user1, user2];

      const result = addCheckboxLabelToUsers(users);

      expect(result).toEqual([
        { id: 1, fullName: 'user 1', emailAddress: '', checkboxLabel: 'Select user: user 1' },
        { id: 2, fullName: 'user 2', emailAddress: '', checkboxLabel: 'Select user: user 2' },
      ]);
    });
  });
});
