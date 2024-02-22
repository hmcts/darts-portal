import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourthousesComponent } from './courthouses.component';

describe('CourthousesComponent', () => {
  let component: CourthousesComponent;
  let fixture: ComponentFixture<CourthousesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourthousesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
