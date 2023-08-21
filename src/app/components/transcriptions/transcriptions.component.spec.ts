import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionsComponent } from './transcriptions.component';

describe('TranscriptionsComponent', () => {
  let component: TranscriptionsComponent;
  let fixture: ComponentFixture<TranscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
