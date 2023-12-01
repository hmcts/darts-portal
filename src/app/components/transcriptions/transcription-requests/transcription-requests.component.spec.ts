import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionRequestsComponent } from './transcription-requests.component';
import { HttpClientModule } from '@angular/common/http';

describe('TranscriptionRequestsComponent', () => {
  let component: TranscriptionRequestsComponent;
  let fixture: ComponentFixture<TranscriptionRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptionRequestsComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
