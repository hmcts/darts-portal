import { User } from '@admin-types/index';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from '@services/groups/groups.service';
import { of } from 'rxjs';
import { RemoveGroupUsersComponent } from './remove-group-users.component';

describe('RemoveGroupUsersComponent', () => {
  let component: RemoveGroupUsersComponent;
  let fixture: ComponentFixture<RemoveGroupUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveGroupUsersComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        {
          provide: GroupsService,
          useValue: {
            assignUsersToGroup: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveGroupUsersComponent);
    component = fixture.componentInstance;
    component.groupUsers = [{ id: 1, fullName: 'User 1' }] as User[];
    component.userIdsToRemove = [1];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove users from group and navigate back', () => {
    jest.spyOn(component.groupService, 'assignUsersToGroup');
    jest.spyOn(component.router, 'navigate');
    component.removeUsers();
    expect(component.groupService.assignUsersToGroup).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/admin/groups', 1], {
      queryParams: { tab: 'Users', removedUsers: 1 },
    });
  });

  it('on cancel should navigate back', () => {
    jest.spyOn(component.router, 'navigate');
    component.cancel();
    expect(component.router.navigate).toHaveBeenCalledWith(['/admin/groups', 1], {
      queryParams: { tab: 'Users' },
    });
  });

  it('should cancel if groupUsers or userIdsToRemove are not provided', () => {
    jest.spyOn(component, 'cancel');
    component.groupUsers = null as unknown as User[];
    component.ngOnInit();
    expect(component.cancel).toHaveBeenCalled();
  });
});
