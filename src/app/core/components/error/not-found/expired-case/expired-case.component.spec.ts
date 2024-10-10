import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredCaseComponent } from './expired-case.component';

describe('ExpiredCaseComponent', () => {
  let component: ExpiredCaseComponent;
  let fixture: ComponentFixture<ExpiredCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredCaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpiredCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
