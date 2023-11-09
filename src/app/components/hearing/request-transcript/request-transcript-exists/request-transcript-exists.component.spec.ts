import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { RequestTranscriptExistsComponent } from './request-transcript-exists.component';

describe('RequestTranscriptExistsComponent', () => {
  let component: RequestTranscriptExistsComponent;
  let fixture: ComponentFixture<RequestTranscriptExistsComponent>;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 },
      },
      params: {
        hearingId: 1,
        caseId: 1,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTranscriptExistsComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    });
    fixture = TestBed.createComponent(RequestTranscriptExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
