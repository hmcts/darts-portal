import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingAudiosComponent } from './hearing-audios.component';

describe('HearingAudiosComponent', () => {
  let component: HearingAudiosComponent;
  let fixture: ComponentFixture<HearingAudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingAudiosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingAudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
