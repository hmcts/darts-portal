import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminService } from '@services/user-admin.service';
import { CreateUserComponent } from './create-user.component';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let userAdminService: Partial<UserAdminService>;

  beforeEach(async () => {
    userAdminService = {};

    await TestBed.configureTestingModule({
      imports: [CreateUserComponent],
      providers: [{ provide: UserAdminService, useValue: userAdminService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
