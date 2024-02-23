import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnotationSuccessComponent } from './add-annotation-success.component';

describe('AddAnnotationSuccessComponent', () => {
  let component: AddAnnotationSuccessComponent;
  let fixture: ComponentFixture<AddAnnotationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnnotationSuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAnnotationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
