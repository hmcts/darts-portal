import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTranscriptComponent } from './request-transcript.component';

describe('RequestTranscriptComponent', () => {
  let component: RequestTranscriptComponent;
  let fixture: ComponentFixture<RequestTranscriptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTranscriptComponent],
    });
    fixture = TestBed.createComponent(RequestTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
