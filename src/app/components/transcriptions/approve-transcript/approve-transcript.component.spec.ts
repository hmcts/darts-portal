import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ApproveTranscriptComponent } from './approve-transcript.component';

describe('ApproveTranscriptComponent', () => {
  let component: ApproveTranscriptComponent;
  let fixture: ComponentFixture<ApproveTranscriptComponent>;
  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 },
      },
      params: {
        transcriptId: 1,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveTranscriptComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }, { provide: DatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
