import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTranscriptExistsComponent } from './request-transcript-exists.component';

describe('RequestTranscriptExistsComponent', () => {
  let component: RequestTranscriptExistsComponent;
  let fixture: ComponentFixture<RequestTranscriptExistsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTranscriptExistsComponent]
    });
    fixture = TestBed.createComponent(RequestTranscriptExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
