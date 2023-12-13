import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranscriptionRequestsComponent } from './transcription-requests.component';

describe('TranscriptionRequestsComponent', () => {
  let component: TranscriptionRequestsComponent;
  let fixture: ComponentFixture<TranscriptionRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptionRequestsComponent, HttpClientModule],
      providers: [{ provide: DatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
