import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourthouseUsersComponent } from './courthouse-users.component';

describe('CourthouseUsersComponent', () => {
  let component: CourthouseUsersComponent;
  let fixture: ComponentFixture<CourthouseUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourthouseUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should initialize variables', () => {});
});
