import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTimesComponent } from './request-times.component';

describe('RequestTimesComponent', () => {
  let component: RequestTimesComponent;
  let fixture: ComponentFixture<RequestTimesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTimesComponent]
    });
    fixture = TestBed.createComponent(RequestTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
