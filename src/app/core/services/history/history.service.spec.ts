import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryService],
    });
    service = TestBed.inject(HistoryService);
  });

  describe('#addBackUrl', () => {
    it('add a back URL to the history', () => {
      service.addBackUrl('/current-page', '/back-page');
      expect(service['backUrlHistory']()).toEqual([['/current-page', '/back-page']]);
    });

    it('append multiple back URLs', () => {
      service.addBackUrl('/page-1', '/back-1');
      service.addBackUrl('/page-2', '/back-2');
      expect(service['backUrlHistory']()).toEqual([
        ['/page-1', '/back-1'],
        ['/page-2', '/back-2'],
      ]);
    });
  });

  describe('#getBackUrl', () => {
    it('return the most recent back URL for a given URL', () => {
      service.addBackUrl('/page-1', '/back-1');
      service.addBackUrl('/page-2', '/back-2');
      service.addBackUrl('/page-2', '/back-3');
      const backUrl = service.getBackUrl('/page-2');
      expect(backUrl).toBe('/back-3');
    });

    it('returns url even if it is a substring', () => {
      service.addBackUrl('/page', '/back-1');
      const backUrl = service.getBackUrl('/page-1?param=value#hash');
      expect(backUrl).toBe('/back-1');
    });

    it('return null if no matching URL is found', () => {
      service.addBackUrl('/page-1', '/back-1');
      const backUrl = service.getBackUrl('/non-existent-page');
      expect(backUrl).toBeNull();
    });
  });

  describe('#clearHistory', () => {
    it('clear the back URL history', () => {
      service.addBackUrl('/page-1', '/back-1');
      service.clearHistory();
      expect(service['backUrlHistory']()).toEqual([]);
    });
  });
});
