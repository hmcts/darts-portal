import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingTranscriptsComponent } from './hearing-transcripts.component';

describe('HearingTranscriptsComponent', () => {
  let component: HearingTranscriptsComponent;
  let fixture: ComponentFixture<HearingTranscriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingTranscriptsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingTranscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
