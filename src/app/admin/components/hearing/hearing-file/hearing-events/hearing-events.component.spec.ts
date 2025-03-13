import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingEventsComponent } from './hearing-events.component';

describe('HearingEventsComponent', () => {
  let component: HearingEventsComponent;
  let fixture: ComponentFixture<HearingEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingEventsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
