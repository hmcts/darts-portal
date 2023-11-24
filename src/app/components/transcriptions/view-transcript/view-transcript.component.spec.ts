import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
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
        { provide: TranscriptionService, useValue: { getTranscriptionDetails: jest.fn() } },
      ],
    });

    fixture = TestBed.createComponent(ViewTranscriptComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const getTranscriptionDetailsSpy = jest.spyOn(component.transcriptionService, 'getTranscriptionDetails');
    fixture.detectChanges();
    expect(getTranscriptionDetailsSpy).toHaveBeenCalledWith('2');
  });

  it('should set the Transcript ID', () => {
    expect(component.transcriptId).toEqual('2');
  });
});
