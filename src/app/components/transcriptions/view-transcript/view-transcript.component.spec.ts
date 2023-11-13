import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from '@services/case/case.service';
import { TranscriptionService } from '@services/transcription/transcription.service';

import { ViewTranscriptComponent } from './view-transcript.component';

describe('ViewTranscriptComponent', () => {
  let component: ViewTranscriptComponent;
  let fixture: ComponentFixture<ViewTranscriptComponent>;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: {
          userId: 123,
          userName: 'dev@local',
          roles: [
            {
              roleId: 123,
              roleName: 'local dev',
              permissions: [
                {
                  permissionId: 1,
                  permissionName: 'local dev permissions',
                },
              ],
            },
          ],
        },
      },
      params: {
        caseId: '1',
        hearing_id: '1',
        transcriptId: '2',
      },
      queryParams: { tab: 'Transcripts' },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewTranscriptComponent, HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CaseService, useValue: { getCase: jest.fn() } },
        { provide: TranscriptionService, useValue: { getTranscriptionDetails: jest.fn() } },
      ],
    });

    fixture = TestBed.createComponent(ViewTranscriptComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const getCaseSpy = jest.spyOn(component.caseService, 'getCase');
    fixture.detectChanges();
    expect(getCaseSpy).toHaveBeenCalledWith('1');

    const getTranscriptionDetailsSpy = jest.spyOn(component.transcriptionService, 'getTranscriptionDetails');
    fixture.detectChanges();
    expect(getTranscriptionDetailsSpy).toHaveBeenCalledWith('2');
  });

  it('should set the Case ID and Transcript ID', () => {
    expect(component.caseId).toEqual('1');
    expect(component.transcriptId).toEqual('2');
  });
});
