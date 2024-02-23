import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { AddAnnotationSuccessComponent } from './add-annotation-success.component';

describe('AddAnnotationSuccessComponent', () => {
  let component: AddAnnotationSuccessComponent;
  let fixture: ComponentFixture<AddAnnotationSuccessComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        userState: { userId: 123 },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnnotationSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAnnotationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
