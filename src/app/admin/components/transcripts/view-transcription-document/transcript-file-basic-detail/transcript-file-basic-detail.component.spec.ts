import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptFileBasicDetailComponent } from './transcript-file-basic-detail.component';

describe('TranscriptFileBasicDetailComponent', () => {
  let component: TranscriptFileBasicDetailComponent;
  let fixture: ComponentFixture<TranscriptFileBasicDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptFileBasicDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TranscriptFileBasicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
