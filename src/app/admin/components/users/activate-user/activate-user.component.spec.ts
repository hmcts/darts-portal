import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { ActivateUserComponent } from './activate-user.component';

describe('ActivateUserComponent', () => {
  let component: ActivateUserComponent;
  let fixture: ComponentFixture<ActivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateUserComponent],
      providers: [{ provide: UserAdminService, useValue: { activateUser: jest.fn().mockReturnValue(of({})) } }],
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
});
