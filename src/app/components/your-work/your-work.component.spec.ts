import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWorkComponent } from './your-work.component';

describe('YourWorkComponent', () => {
  let component: YourWorkComponent;
  let fixture: ComponentFixture<YourWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourWorkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YourWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
