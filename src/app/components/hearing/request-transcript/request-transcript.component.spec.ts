import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Case, Hearing } from '@darts-types/index';
import { CaseService } from '@services/case/case.service';
import { Observable, of } from 'rxjs';

import { RequestTranscriptComponent } from './request-transcript.component';

describe('RequestTranscriptComponent', () => {
  let component: RequestTranscriptComponent;
  let fixture: ComponentFixture<RequestTranscriptComponent>;
  let caseService: CaseService;
  let httpClientSpy: HttpClient;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 },
      },
      params: {
        hearingId: 1,
      },
      queryParams: { tab: 'Transcripts' },
    },
  };

  const cd = of({ case_id: 1, case_number: '12345', courthouse: 'Reading', judges: ['Judy'] }) as Observable<Case>;
  const shd = of({
    id: 1,
    date: '2023-02-21',
    judges: ['Joseph', 'Judy'],
    courtroom: '3',
    transcript_count: 99,
  }) as Observable<Hearing>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    caseService = new CaseService(httpClientSpy);

    jest.spyOn(caseService, 'getCase').mockReturnValue(cd);
    jest.spyOn(caseService, 'getHearingById').mockReturnValue(shd);

    TestBed.configureTestingModule({
      imports: [RequestTranscriptComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CaseService, useValue: caseService },
      ],
    });
    fixture = TestBed.createComponent(RequestTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
