import { TestBed } from '@angular/core/testing';

import { FileDownloadService } from './file-download.service';

describe('FileDownloadService', () => {
  let service: FileDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveAs should download blob', () => {
    const mockBlob = new Blob(['test data'], { type: 'text/plain' });
    Object.defineProperty(window.URL, 'createObjectURL', { value: jest.fn() });
    Object.defineProperty(window.URL, 'revokeObjectURL', { value: jest.fn() });

    const createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('mock-url');
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(document.createElement('a'));
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const revokeObjectURLMock = jest.spyOn(window.URL, 'revokeObjectURL');

    service.saveAs(mockBlob, 'test.zip');

    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
    expect(revokeObjectURLMock).toHaveBeenCalledWith('mock-url');
  });
});
