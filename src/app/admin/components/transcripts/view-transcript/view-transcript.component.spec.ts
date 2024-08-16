import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranscriptFacadeService } from 'src/app/admin/facades/transcript/transcript-facade.service';
import { ViewTranscriptComponent } from './view-transcript.component';

const transcriptFacadeServiceMock = {
  getTranscript: jest.fn().mockReturnValue(null),
  getHistory: jest.fn().mockReturnValue([]),
};

const activatedRouteMock = {
  snapshot: {
    params: { transcriptionId: '123' },
    queryParams: {},
  },
};

const setup = (activatedRoute: unknown, transcripFacadeService: unknown) => {
  return TestBed.configureTestingModule({
    providers: [
      ViewTranscriptComponent,
      { provide: TranscriptFacadeService, useValue: transcripFacadeService },
      { provide: ActivatedRoute, useValue: activatedRoute },
    ],
  }).createComponent(ViewTranscriptComponent);
};

describe('ViewTranscriptComponent', () => {
  let component: ViewTranscriptComponent;

  describe('default init', () => {
    beforeEach(() => {
      component = setup(activatedRouteMock, transcriptFacadeServiceMock).componentInstance;
    });

    it('set transcriptionId from route param', () => {
      expect(component.transcriptionId).toBe(123);
    });

    it('set updatedStatus to false if not present in route param', () => {
      expect(component.updatedStatus).toBe(false);
    });

    it('get transcript from facade with transcriptionId', () => {
      expect(component.transcriptFacade.getTranscript).toHaveBeenCalledWith(123);
    });

    it('get history from facade with transcriptionId', () => {
      expect(component.transcriptFacade.getHistory).toHaveBeenCalledWith(123);
    });

    it('set transcript and history from facade', () => {
      expect(component.transcript).toBe(null);
      expect(component.history).toEqual([]);
    });
  });

  it('set updatedStatus to true if present in route param', () => {
    const activatedRoute = {
      ...activatedRouteMock,
      snapshot: { ...activatedRouteMock.snapshot, queryParams: { updatedStatus: true } },
    };
    component = setup(activatedRoute, transcriptFacadeServiceMock).componentInstance;
    expect(component.updatedStatus).toBe(true);
  });
});
