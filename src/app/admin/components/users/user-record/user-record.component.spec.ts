import { User } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { of } from 'rxjs/internal/observable/of';
import { UserRecordComponent } from './user-record.component';

describe('UserRecordComponent', () => {
  let component: UserRecordComponent;
  let fixture: ComponentFixture<UserRecordComponent>;
  let fakeUserAdminService: Partial<UserAdminService>;
  let fakeActivatedRoute: ActivatedRoute;

  const TEST_USER: User = {
    id: 123,
    fullName: 'Test User',
    lastLoginAt: DateTime.fromISO('2021-01-01'),
    lastModifiedAt: DateTime.fromISO('2021-01-01'),
    createdAt: DateTime.fromISO('2021-01-01'),
    emailAddress: 'test@user.com',
    description: '',
    active: true,
    securityGroupIds: [],
  };

  const mockQueryParams = new BehaviorSubject<{ [key: string]: boolean }>({ newUser: false });

  beforeEach(async () => {
    fakeUserAdminService = {
      getUser: () => of(TEST_USER),
    };
    fakeActivatedRoute = {
      snapshot: {
        params: {
          userId: 123,
        },
      },
      queryParams: mockQueryParams.asObservable(),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [UserRecordComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: UserAdminService, useValue: fakeUserAdminService },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('render success banner when new user', () => {
    mockQueryParams.next({ newUser: true });

    fixture.detectChanges();

    const successBanner = fixture.debugElement.query(By.css('app-govuk-banner'));
    expect(successBanner).toBeTruthy();
  });

  it('does not render success banner when not new user', () => {
    mockQueryParams.next({ newUser: false });

    fixture.detectChanges();

    const successBanner = fixture.debugElement.query(By.css('app-govuk-banner'));
    expect(successBanner).toBeFalsy();
  });

  it('render success banner when updated user', () => {
    mockQueryParams.next({ updated: true });

    fixture.detectChanges();

    const successBanner = fixture.debugElement.query(By.css('app-govuk-banner'));
    expect(successBanner).toBeTruthy();
  });

  describe('onActivateDeactivateUser', () => {
    it('when user is inactive should navigate to activate journey', () => {
      const router = TestBed.inject(Router);
      const routerSpy = jest.spyOn(router, 'navigate');
      const inactiveUser = { ...TEST_USER, active: false };

      component.onActivateDeactivateUser(inactiveUser);

      expect(routerSpy).toHaveBeenCalledWith(['admin/users', TEST_USER.id, 'activate'], {
        state: { user: inactiveUser },
      });
    });

    it('when user is active should navigate to deactivate journey', () => {
      const router = TestBed.inject(Router);
      const routerSpy = jest.spyOn(router, 'navigate');
      const activeUser = { ...TEST_USER, active: true };

      component.onActivateDeactivateUser(activeUser);

      expect(routerSpy).toHaveBeenCalledWith(['admin/users', TEST_USER.id, 'deactivate'], {
        state: { user: activeUser },
      });
    });

    it('when user is inactive and missing full name should set activation error', () => {
      const router = TestBed.inject(Router);
      const routerSpy = jest.spyOn(router, 'navigate');

      component.onActivateDeactivateUser({ ...TEST_USER, active: false, fullName: '' });

      expect(routerSpy).not.toHaveBeenCalled();
      expect(component.activationError()).toBeTruthy();
    });
  });
});
