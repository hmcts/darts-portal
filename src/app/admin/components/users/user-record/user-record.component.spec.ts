import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordComponent } from './user-record.component';

describe('UserRecordComponent', () => {
  let component: UserRecordComponent;
  let fixture: ComponentFixture<UserRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
