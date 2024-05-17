import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroup, User } from '@admin-types/index';
import { Navigation, Router } from '@angular/router';
import { GroupsService } from '@services/groups/groups.service';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { DeactivateUserComponent } from './deactivate-user.component';

describe('DeactivateUserComponent', () => {
  let component: DeactivateUserComponent;
  let fixture: ComponentFixture<DeactivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateUserComponent],
      providers: [
        { provide: UserAdminService, useValue: { deactivateUser: jest.fn() } },
        { provide: GroupsService, useValue: { getGroupsWhereUserIsTheOnlyMember: jest.fn().mockReturnValue(of([])) } },
        { provide: HeaderService, useValue: { hideNavigation: jest.fn() } },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({
      extras: {
        state: {
          user: { id: 1 } as User,
        },
      },
    } as unknown as Navigation);

    fixture = TestBed.createComponent(DeactivateUserComponent);
    component = fixture.componentInstance;
    component.user = { id: 1 } as User;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should hide navigation if isSuperAdminError is true', () => {
      const headerService = TestBed.inject(HeaderService);

      jest.spyOn(headerService, 'hideNavigation');

      component.isSuperAdminError.set(true);

      fixture.detectChanges();

      expect(headerService.hideNavigation).toHaveBeenCalled();
    });
  });

  describe('deactivateUser', () => {
    it('should call userAdminService.deactivateUser and navigate to user record', () => {
      const userAdminService = TestBed.inject(UserAdminService);
      const router = TestBed.inject(Router);

      jest.spyOn(userAdminService, 'deactivateUser').mockReturnValue(of([]));
      jest.spyOn(router, 'navigate');

      component.deactivateUser();

      expect(userAdminService.deactivateUser).toHaveBeenCalledWith(1);
      expect(router.navigate).toHaveBeenCalledWith(['/admin/users', 1], {
        queryParams: { deactivated: true, rolledBackTranscriptRequestIds: [] },
      });
    });

    it('should navigate to user record with rolledBackTranscriptRequestIds', () => {
      const userAdminService = TestBed.inject(UserAdminService);
      const router = TestBed.inject(Router);

      jest.spyOn(userAdminService, 'deactivateUser').mockReturnValue(of([1, 2]));
      jest.spyOn(router, 'navigate');

      component.deactivateUser();

      expect(userAdminService.deactivateUser).toHaveBeenCalledWith(1);
      expect(router.navigate).toHaveBeenCalledWith(['/admin/users', 1], {
        queryParams: { deactivated: true, rolledBackTranscriptRequestIds: [1, 2] },
      });
    });
  });

  describe('doesGroupsContainSuperAdmin', () => {
    it('should return true if groups contain super admin', () => {
      expect(component.doesGroupsContainSuperAdmin([{ name: 'SUPER_ADMIN' } as SecurityGroup])).toBe(true);
    });

    it('should return false if groups do not contain super admin', () => {
      expect(component.doesGroupsContainSuperAdmin([{ name: 'ADMIN' } as SecurityGroup])).toBe(false);
    });
  });

  describe('groups$', () => {
    it('should set isSuperAdminError to true if groups contain super admin', () => {
      const groupsService = TestBed.inject(GroupsService);

      jest
        .spyOn(groupsService, 'getGroupsWhereUserIsTheOnlyMember')
        .mockReturnValue(of([{ name: 'SUPER_ADMIN' } as SecurityGroup]));

      component.groups$.subscribe(() => {
        expect(component.isSuperAdminError()).toBe(true);
      });
    });

    it('should set isSuperAdminError to false if groups do not contain super admin', () => {
      const groupsService = TestBed.inject(GroupsService);

      jest
        .spyOn(groupsService, 'getGroupsWhereUserIsTheOnlyMember')
        .mockReturnValue(of([{ name: 'ADMIN' } as SecurityGroup]));

      component.groups$.subscribe(() => {
        expect(component.isSuperAdminError()).toBe(false);
      });
    });
  });
});
