import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroup } from '@admin-types/index';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { GroupsService } from '@services/groups/groups.service';
import { of } from 'rxjs';
import { GroupsComponent } from './groups.component';

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  const mockGroupsAndRoles = {
    groups: [
      {
        id: 1,
        name: 'Group 1',
        displayState: true,
        securityRoleId: 1,
        role: { id: 1, displayName: 'Role 1', displayState: true },
      },
      {
        id: 2,
        name: 'Group 2',
        displayState: false,
        securityRoleId: 2,
        role: { id: 2, displayName: 'Role 2', displayState: false },
      },
      {
        id: 3,
        name: 'Group 3 visible',
        displayState: true,
        securityRoleId: 2,
        role: { id: 2, displayName: 'Role 4', displayState: false },
      },
      {
        id: 4,
        name: 'Group 4 not visible',
        displayState: false,
        securityRoleId: 2,
        role: { id: 1, displayName: 'Role 3', displayState: true },
      },
    ],
    roles: [
      { id: 1, displayName: 'Role 1', displayState: true },
      { id: 2, displayName: 'Role 2', displayState: false },
      { id: 2, displayName: 'Role 3', displayState: true },
      { id: 2, displayName: 'Role 4', displayState: false },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsComponent],
      providers: [
        { provide: GroupsService, useValue: { getGroupsAndRoles: jest.fn().mockReturnValue(of(mockGroupsAndRoles)) } },
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display only visible groups and roles', () => {
    fixture.detectChanges();
    const groupsTable = fixture.nativeElement.querySelector('#groups-table');

    expect(groupsTable.textContent).toContain('Group 1');
    expect(groupsTable.textContent).not.toContain('Group 2');

    expect(groupsTable.textContent).toContain('Role 1');
    expect(groupsTable.textContent).not.toContain('Role 2');

    expect(groupsTable.textContent).toContain('Group 3');

    expect(groupsTable.textContent).not.toContain('Group 4');
  });

  it('should filter groups based on search and role', () => {
    component.searchFormControl.setValue('Group 1');
    component.rolesFormControl.setValue('Role 1');

    fixture.detectChanges();

    let filterResults: SecurityGroup[] = [];

    component.filteredGroups$.subscribe((filteredGroups) => {
      filterResults = filteredGroups;
    });

    expect(filterResults.length).toEqual(2);
    expect(filterResults[0].name).toEqual('Group 1');
  });

  it('should update loading state when data is fetched', () => {
    expect(component.loading$.value).toEqual(true);
    fixture.detectChanges();
    expect(component.loading$.value).toEqual(false);
  });

  describe('private method - roleFilter', () => {
    it('should return true if role found', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).roleFilter('ROLE', {
          role: { name: 'ROLE' },
        })
      ).toEqual(true);
    });
    it('should return false if role not found', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).roleFilter('NOPE', {
          role: { name: 'ROLE' },
        })
      ).toEqual(false);
    });
  });

  describe('private method - searchFilter', () => {
    it('should return true if group found', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).searchFilter('ROLE', {
          name: 'ROLE',
        })
      ).toEqual(true);
    });
    it('should return false if group not found', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).searchFilter('NOPE', {
          name: 'ROLE',
        })
      ).toEqual(false);
    });
  });
});
