import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptFileAdvancedDetailComponent } from './transcript-file-advanced-detail.component';

describe('TranscriptFileAdvancedDetailComponent', () => {
  let component: TranscriptFileAdvancedDetailComponent;
  let fixture: ComponentFixture<TranscriptFileAdvancedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptFileAdvancedDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TranscriptFileAdvancedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
