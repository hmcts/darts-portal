import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '@services/history/history.service';
import { of } from 'rxjs';
import { TranscriptFacadeService } from 'src/app/admin/facades/transcript/transcript-facade.service';
import { ViewTranscriptComponent } from './view-transcript.component';

const transcriptFacadeServiceMock = {
  getTranscript: jest.fn().mockReturnValue(of(null)),
  getHistory: jest.fn().mockReturnValue(of([])),
};

const activatedRouteMock = {
  snapshot: {
    params: { transcriptionId: '123' },
    queryParams: {},
  },
};

const historyServiceMock = {
  getBackUrl: jest.fn(),
};

describe('ViewTranscriptComponent', () => {
  let component: ViewTranscriptComponent;
  let fixture: ComponentFixture<ViewTranscriptComponent>;

  const setup = (
    activatedRoute: unknown,
    transcriptFacadeService: unknown,
    historyService: unknown,
    updatedStatusQueryParam?: 'true' | 'false'
  ) => {
    TestBed.configureTestingModule({
      providers: [
        ViewTranscriptComponent,
        { provide: TranscriptFacadeService, useValue: transcriptFacadeService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HistoryService, useValue: historyService },
      ],
    });

    fixture = TestBed.createComponent(ViewTranscriptComponent);
    fixture.componentRef.setInput('updatedStatus', updatedStatusQueryParam);
    component = fixture.componentInstance;
  };

  describe('default init', () => {
    beforeEach(() => {
      setup(activatedRouteMock, transcriptFacadeServiceMock, historyServiceMock);
    });

    it('set transcriptionId from route param', () => {
      expect(component.transcriptionId).toBe(123);
    });

    it('set updatedStatus to null if not present in route param', () => {
      expect(component.updatedStatus()).toBe(null);
    });

    it('get transcript from facade with transcriptionId', () => {
      expect(component.transcriptFacade.getTranscript).toHaveBeenCalledWith(123);
    });

    it('get history from facade with transcriptionId', () => {
      expect(component.transcriptFacade.getHistory).toHaveBeenCalledWith(123);
    });

    it('set transcript and history from facade', () => {
      expect(component.transcript()).toBe(null);
      expect(component.history()).toEqual([]);
    });

    it('set backUrl to be default', () => {
      expect(component.backUrl).toBe('/admin/transcripts');
    });
  });

  describe('when updatedStatus is true', () => {
    it('set updatedStatus to true', () => {
      setup(activatedRouteMock, transcriptFacadeServiceMock, historyServiceMock, 'true');
      expect(component.updatedStatus()).toBe(true);
    });
  });

  describe('when updatedStatus is false', () => {
    it('set updatedStatus to false', () => {
      setup(activatedRouteMock, transcriptFacadeServiceMock, historyServiceMock, 'false');
      expect(component.updatedStatus()).toBe(false);
    });
  });

  describe('when backUrl is set in history service', () => {
    it('should set backUrl to the value returned from history service', () => {
      historyServiceMock.getBackUrl.mockReturnValue('/back-url');
      setup(activatedRouteMock, transcriptFacadeServiceMock, historyServiceMock);
      expect(component.backUrl).toBe('/back-url');
    });

    it('should set backUrl to default if history service returns null', () => {
      historyServiceMock.getBackUrl.mockReturnValue(null);
      setup(activatedRouteMock, transcriptFacadeServiceMock, historyServiceMock);
      expect(component.backUrl).toBe('/admin/transcripts');
    });
  });
});
