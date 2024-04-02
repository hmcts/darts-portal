import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroup } from '@admin-types/index';
import { RouterTestingModule } from '@angular/router/testing';
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
        securityRoleId: 1,
        role: { id: 1, displayName: 'Role 1', displayState: true },
      },
      {
        id: 2,
        name: 'Group 2',
        securityRoleId: 2,
        role: { id: 2, displayName: 'Role 2', displayState: false },
      },
    ],
    roles: [
      { id: 1, displayName: 'Role 1', displayState: true },
      { id: 2, displayName: 'Role 2', displayState: false },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsComponent, RouterTestingModule],
      providers: [
        { provide: GroupsService, useValue: { getGroupsAndRoles: jest.fn().mockReturnValue(of(mockGroupsAndRoles)) } },
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
  });

  it('should filter groups based on search and role', () => {
    component.searchFormControl.setValue('Group 1');
    component.rolesFormControl.setValue('Role 1');

    fixture.detectChanges();

    let filterResults: SecurityGroup[] = [];

    component.filteredGroups$.subscribe((filteredGroups) => {
      filterResults = filteredGroups;
    });

    expect(filterResults.length).toEqual(1);
    expect(filterResults[0].name).toEqual('Group 1');
  });

  it('should update loading state when data is fetched', () => {
    expect(component.loading$.value).toEqual(true);
    fixture.detectChanges();
    expect(component.loading$.value).toEqual(false);
  });
});
