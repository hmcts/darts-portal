import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { AssignGroupsComponent } from './assign-groups.component';

describe('AssignGroupsComponent', () => {
  let component: AssignGroupsComponent;
  let fixture: ComponentFixture<AssignGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignGroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter groups based on search and roles', fakeAsync(() => {
    let result;
    const groups = [
      { id: 1, name: 'Group 1', role: 'Role 1' },
      { id: 2, name: 'Group 2', role: 'Role 2' },
      { id: 3, name: 'Group 3', role: 'Role 1' },
      { id: 4, name: 'Approver Group', role: 'Approver' },
    ];
    component.groups = groups;
    component.ngOnInit();

    component.filteredGroups$?.subscribe((filteredGroups) => {
      result = filteredGroups;
    });

    // Test with empty search and roles
    component.searchFormControl.setValue('');
    component.rolesFormControl.setValue([]);

    expect(result).toEqual(groups);

    // Test with search and roles
    component.searchFormControl.setValue('Group');
    component.rolesFormControl.setValue([{ name: 'Role 1' }]);

    expect(result).toEqual([
      { id: 1, name: 'Group 1', role: 'Role 1' },
      { id: 3, name: 'Group 3', role: 'Role 1' },
    ]);

    // Test with search and no roles
    component.searchFormControl.setValue('rover');
    component.rolesFormControl.setValue([]);

    expect(result).toEqual([{ id: 4, name: 'Approver Group', role: 'Approver' }]);
  }));

  it('should deselect group', () => {
    const group1 = { id: 1, name: 'Group 1', role: 'Role 1' };
    const group2 = { id: 2, name: 'Group 2', role: 'Role 2' };
    component.selectedGroups = [group1, group2];

    component.deselectGroup(1);
    expect(component.selectedGroups).toEqual([group2]);

    component.deselectGroup(2);
    expect(component.selectedGroups).toEqual([]);
  });

  it('should emit selected groups on assign', () => {
    const group1 = { id: 1, name: 'Group 1', role: 'Role 1' };
    const group2 = { id: 2, name: 'Group 2', role: 'Role 2' };
    component.selectedGroups = [group1, group2];

    jest.spyOn(component.assign, 'emit');
    component.onAssign();
    expect(component.assign.emit).toHaveBeenCalledWith([group1, group2]);
  });
});
