import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTranscriptSuccessComponent } from './request-transcript-success.component';

describe('RequestTranscriptSuccessComponent', () => {
  let component: RequestTranscriptSuccessComponent;
  let fixture: ComponentFixture<RequestTranscriptSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTranscriptSuccessComponent]
    });
    fixture = TestBed.createComponent(RequestTranscriptSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
