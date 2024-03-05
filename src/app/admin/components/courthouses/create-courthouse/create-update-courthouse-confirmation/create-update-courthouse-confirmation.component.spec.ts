import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCourthouseConfirmationComponent } from './create-update-courthouse-confirmation.component';

describe('CreateUpdateCourthouseConfirmationComponent', () => {
  let component: CreateUpdateCourthouseConfirmationComponent;
  let fixture: ComponentFixture<CreateUpdateCourthouseConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateCourthouseConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCourthouseConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
