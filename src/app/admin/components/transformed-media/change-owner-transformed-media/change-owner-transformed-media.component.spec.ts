import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { ChangeOwnerTransformedMediaComponent } from './change-owner-transformed-media.component';

describe('ChangeOwnerTransformedMediaComponent', () => {
  let component: ChangeOwnerTransformedMediaComponent;
  let fixture: ComponentFixture<ChangeOwnerTransformedMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeOwnerTransformedMediaComponent],
      providers: [
        {
          provide: UserAdminService,
          useValue: {
            getUsers: jest.fn().mockReturnValue(of([])),
          },
        },
        {
          provide: TransformedMediaService,
          useValue: {
            changeMediaRequestOwner: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: HeaderService,
          useValue: {
            hideNavigation: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: 1,
                mediaRequestId: 1,
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeOwnerTransformedMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onUserSelect', () => {
    it('should set selectedUser', () => {
      const selectedUser: AutoCompleteItem = {
        id: 0,
        name: 'Dean',
      };
      component.onUserSelect(selectedUser);

      expect(component.selectedUser).toEqual(selectedUser);
    });
  });

  describe('onSave', () => {
    it('should set invalidUserSubmitted to true if selectedUser is null', () => {
      component.selectedUser = null;

      component.onSave();

      expect(component.invalidUserSubmitted).toBe(true);
    });

    it('should call changeMediaRequestOwner and navigate to transformed media page with ownerChanged query param', () => {
      component.selectedUser = {
        id: 9,
        name: 'Dean (dean@dean.com)',
      };
      const routerSpy = jest.spyOn(component.router, 'navigate');
      const changeMediaRequestOwnerSpy = jest.spyOn(component.transformedMediaService, 'changeMediaRequestOwner');

      component.onSave();

      expect(changeMediaRequestOwnerSpy).toHaveBeenCalledWith(1, 9);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/transformed-media', component.transformedMediaId], {
        queryParams: { ownerChanged: 'Dean ' },
      });
    });
  });

  describe('onCancel', () => {
    it('should navigate to transformed media page', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.onCancel();

      expect(routerSpy).toHaveBeenCalledWith(['/admin/transformed-media', component.transformedMediaId]);
    });
  });

  describe('mapUsersToAutoCompleteItems', () => {
    it('should map users to AutoCompleteItems', () => {
      const users = [
        {
          id: 1,
          fullName: 'Dean',
          emailAddress: 'dean@dean.com',
        } as User,
      ];
      const expectedAutoCompleteItems = [
        {
          id: 1,
          name: 'Dean (dean@dean.com)',
        },
      ];

      const result = component.mapUsersToAutoCompleteItems(users);

      expect(result).toEqual(expectedAutoCompleteItems);
    });
  });

  describe('ngOnInit', () => {
    it('should call headerService.hideNavigation', () => {
      const hideNavigationSpy = jest.spyOn(component.headerService, 'hideNavigation');

      component.ngOnInit();

      expect(hideNavigationSpy).toHaveBeenCalled();
    });
  });
});
