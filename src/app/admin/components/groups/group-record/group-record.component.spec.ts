import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { ActivatedRoute } from '@angular/router';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { GroupRecordComponent } from './group-record.component';

describe('GroupRecordComponent', () => {
  let component: GroupRecordComponent;
  let fixture: ComponentFixture<GroupRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRecordComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        {
          provide: GroupsService,
          useValue: {
            getGroupAndRole: jest.fn().mockReturnValue(
              of({
                id: 1,
                courthouseIds: [1, 2, 3],
                userIds: [1, 2, 3],
                role: { name: 'ADMIN', displayName: 'Admin' },
                description: ' test',
                name: 'Group 1',
              })
            ),
            assignCourthousesToGroup: jest.fn().mockReturnValue(of({})),
            assignUsersToGroup: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: CourthouseService,
          useValue: { getCourthouses: jest.fn().mockReturnValue(of([{ id: 1 }, { id: 2 }, { id: 3 }])) },
        },
        {
          provide: UserAdminService,
          useValue: { getUsers: jest.fn().mockReturnValue(of([{ id: 1 }, { id: 2 }, { id: 3 }])) },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 1 },
              queryParams: { tab: 'Courthouses' },
            },
            queryParams: of({ removedUsers: '1' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('render group details', () => {
    expect(fixture.nativeElement.querySelector('#group-name').textContent).toContain('Group 1');
    expect(fixture.nativeElement.querySelector('#group-description').textContent).toContain('test');
    expect(fixture.nativeElement.querySelector('#group-role').textContent).toContain('Admin');
  });

  it('should update courthouses when onUpdateCourthouses is called', () => {
    const courthouseIds = [1, 2, 3];
    component.groupId = 1;
    component.onUpdateCourthouses(courthouseIds);
    expect(component.groupsService.assignCourthousesToGroup).toHaveBeenCalledWith(1, courthouseIds);
  });

  it('should update users when onUpdateUsers is called', () => {
    const userIds = [1, 2, 3];
    component.groupId = 1;
    component.onUpdateUsers(userIds);
    expect(component.groupsService.assignUsersToGroup).toHaveBeenCalledWith(1, userIds);
  });

  it('should navigate to remove-users route when onRemoveUsers is called', () => {
    const groupUsers = [
      { id: 1, fullName: 'John' },
      { id: 2, fullName: 'Jane' },
    ] as User[];
    const userIdsToRemove: number[] = [1, 2];
    const routerSpy = jest.spyOn(component.router, 'navigate');

    component.groupId = 1;
    component.onRemoveUsers({ groupUsers, userIdsToRemove });

    expect(routerSpy).toHaveBeenCalledWith(['/admin/groups', 1, 'remove-users'], {
      state: { groupUsers, userIdsToRemove },
    });
  });
});
