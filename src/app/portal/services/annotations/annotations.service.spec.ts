import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnotationsService } from './annotations.service';

describe('AnnotationsService', () => {
  let service: AnnotationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AnnotationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#downloadAnnotationDocument', () => {
    it('should call the correct endpoint and return a Blob', (done) => {
      const annotationId = 1;
      const AnnotationDocumentId = 1;
      const mockBlob = new Blob(['test'], { type: 'text/plain' });

      service.downloadAnnotationDocument(annotationId, AnnotationDocumentId).subscribe((result) => {
        expect(result instanceof Blob).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/api/annotations/${annotationId}/documents/${AnnotationDocumentId}`);
      req.flush(mockBlob);
    });
  });
});
