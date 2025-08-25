import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { provideHttpClient } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourthouseData } from '@core-types/courthouse/courthouse.interface';
import { UserState } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { GroupRecordComponent } from './group-record.component';

describe('GroupRecordComponent', () => {
  let component: GroupRecordComponent;
  let fixture: ComponentFixture<GroupRecordComponent>;

  const mockUserState: WritableSignal<UserState | null> = signal({ userId: 3 } as UserState);

  const userServiceMock: Partial<UserService> = {
    hasMatchingUserId: jest.fn().mockReturnValue(true),
    isAdmin: jest.fn().mockReturnValue(true),
    userState: mockUserState,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRecordComponent],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
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
        provideHttpClient(),
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
    component.groupId = 1;
    component.onUpdateCourthouses({
      selectedCourthouses: [
        { id: 1, display_name: 'Courthouse 1' } as unknown as CourthouseData,
        { id: 2, display_name: 'Courthouse 2' } as unknown as CourthouseData,
        { id: 3, display_name: 'Courthouse 3' } as unknown as CourthouseData,
      ],
      addedCourtHouse: undefined,
      removedCourtHouse: undefined,
    });
    expect(component.groupsService.assignCourthousesToGroup).toHaveBeenCalledWith(1, [1, 2, 3]);
  });

  it('should update successBannerText with added court case when onUpdateCourthouses is called with addedCourtHouse argument', () => {
    component.groupId = 1;
    component.onUpdateCourthouses({
      selectedCourthouses: [
        { id: 1, display_name: 'Courthouse 1' } as unknown as CourthouseData,
        { id: 2, display_name: 'Courthouse 2' } as unknown as CourthouseData,
        { id: 3, display_name: 'Courthouse 3' } as unknown as CourthouseData,
      ],
      addedCourtHouse: { id: 1, display_name: 'Courthouse 1' } as unknown as CourthouseData,
      removedCourtHouse: undefined,
    });
    expect(component.groupsService.assignCourthousesToGroup).toHaveBeenCalledWith(1, [1, 2, 3]);
    expect(component.successBannerText()).toContain('Courthouse 1 added');
  });

  it('should update successBannerText with removed court case when onUpdateCourthouses is called with removedCourtHouse argument', () => {
    component.groupId = 1;
    component.onUpdateCourthouses({
      selectedCourthouses: [
        { id: 1, display_name: 'Courthouse 1' } as unknown as CourthouseData,
        { id: 2, display_name: 'Courthouse 2' } as unknown as CourthouseData,
        { id: 3, display_name: 'Courthouse 3' } as unknown as CourthouseData,
      ],
      addedCourtHouse: undefined,
      removedCourtHouse: { id: 1, display_name: 'Courthouse 1' } as unknown as CourthouseData,
    });
    expect(component.groupsService.assignCourthousesToGroup).toHaveBeenCalledWith(1, [1, 2, 3]);
    expect(component.successBannerText()).toContain('Courthouse 1 removed');
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

    jest.spyOn(component.userService, 'hasMatchingUserId').mockReturnValue(false);

    component.groupId = 1;
    component.onRemoveUsers({ groupUsers, userIdsToRemove });

    expect(routerSpy).toHaveBeenCalledWith(['/admin/groups', 1, 'remove-users'], {
      state: { groupUsers, userIdsToRemove },
    });
  });

  it('should set error summary if trying to remove own user', () => {
    jest.spyOn(userServiceMock, 'hasMatchingUserId').mockReturnValue(true);

    const scrollSpy = jest.spyOn(component.scrollService, 'scrollTo');
    const errorSpy = jest.spyOn(component.errorSummary, 'set');

    const groupUsers = [{ id: 3, fullName: 'Self User' }] as User[];
    const userIdsToRemove = [3];

    component.onRemoveUsers({ groupUsers, userIdsToRemove });

    expect(scrollSpy).toHaveBeenCalledWith('app-validation-error-summary');
    expect(errorSpy).toHaveBeenCalledWith([
      {
        fieldId: 'group-users',
        message: 'You cannot assign yourself to or remove yourself from any group.',
      },
    ]);
  });

  it('should set error summary and scroll to the error summary component', () => {
    const scrollSpy = jest.spyOn(component.scrollService, 'scrollTo');
    const error = {
      fieldId: 'group-users',
      message: 'You cannot assign yourself to or remove yourself from any group.',
    };

    component.onValidationError(error);

    expect(component.errorSummary()).toEqual([error]);
    expect(scrollSpy).toHaveBeenCalledWith('app-validation-error-summary');
  });
});
