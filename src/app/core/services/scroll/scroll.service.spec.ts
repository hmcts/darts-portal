import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('scrollTo', () => {
    it('should scroll to the element with the given selector', fakeAsync(() => {
      const element = document.createElement('div');
      element.id = 'test';
      document.body.appendChild(element);

      const scrollIntoViewSpy = jest.spyOn(element, 'scrollIntoView');

      service.scrollTo('#test');
      tick(100);

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }));

    it('should log an error if the element is not found', fakeAsync(() => {
      const consoleErrorSpy = jest.spyOn(console, 'error');

      service.scrollTo('#none');
      tick(100);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Element with selector #none not found');
    }));
  });

  describe('scrollToTop', () => {
    it('should scroll to the top of the page', () => {
      jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
      service.scrollToTop();
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    });
  });
});
