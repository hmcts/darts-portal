import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUsersComponent } from './group-users.component';

describe('GroupUsersComponent', () => {
  let component: GroupUsersComponent;
  let fixture: ComponentFixture<GroupUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
