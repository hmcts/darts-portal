import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of, throwError } from 'rxjs';
import { UserRecordComponent } from '../user-record/user-record.component';
import { ActivateUserComponent } from './activate-user.component';

describe('ActivateUserComponent', () => {
  let component: ActivateUserComponent;
  let fixture: ComponentFixture<ActivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateUserComponent],
      providers: [
        { provide: UserAdminService, useValue: { activateUser: jest.fn().mockReturnValue(of({})) } },
        provideRouter([{ path: 'admin/users/:id', component: UserRecordComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateUserComponent);
    component = fixture.componentInstance;
    component.user = { id: 123, email: 'email@test.com', fullName: 'Test User' } as unknown as User;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate user', () => {
    const userAdminService = TestBed.inject(UserAdminService);
    const activateUserSpy = jest.spyOn(userAdminService, 'activateUser');
    component.activateUser();
    expect(activateUserSpy).toHaveBeenCalledWith(123);
  });

  it('should navigate back to user record on cancel', () => {
    const router = TestBed.inject(Router);
    const routerSpy = jest.spyOn(router, 'navigate');

    fixture.debugElement.query(By.css('#cancel-button')).nativeElement.click();

    expect(routerSpy).toHaveBeenCalledWith(['admin/users', 123]);
  });

  it('should navigate to user record with error 409', () => {
    const userAdminService = TestBed.inject(UserAdminService);
    const router = TestBed.inject(Router);

    jest
      .spyOn(userAdminService, 'activateUser')
      .mockReturnValue(throwError(() => ({ status: 409 }) as HttpErrorResponse));
    jest.spyOn(router, 'navigate');

    component.activateUser();

    expect(userAdminService.activateUser).toHaveBeenCalledWith(123);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users', 123], { queryParams: { error: 409 } });
  });
});
