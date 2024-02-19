import { of } from 'rxjs';
import { AnnotationService } from '@services/annotation/annotation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

describe('AnnotationService', () => {
  let service: AnnotationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnnotationService],
    });
    service = TestBed.inject(AnnotationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#downloadAnnotationDocument', () => {
    it('should get annotation document', () => {
      const annotationId = 123;
      const annotationDocumentId = 321;
      const mockBlob = new Blob(['mock document data'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      jest.spyOn(service['http'], 'get').mockReturnValueOnce(of(mockBlob));

      let receivedBlob: Blob | undefined;
      service.downloadAnnotationDocument(annotationId, annotationDocumentId).subscribe((blob: Blob) => {
        receivedBlob = blob;
      });

      const expectedUrl = `/api/annotations/${annotationId}/documents/${annotationDocumentId}`;
      expect(service['http'].get).toHaveBeenCalledWith(expectedUrl, {
        responseType: 'blob',
      });

      expect(receivedBlob).toBeInstanceOf(Blob);
    });
  });

  describe('#deleteAnnotation', () => {
    it('should delete annotation', () => {
      const annotationId = 123;
      jest.spyOn(service['http'], 'delete').mockReturnValueOnce(of({}));

      service.deleteAnnotation(annotationId).subscribe();

      const expectedUrl = `/api/annotations/${annotationId}`;
      expect(service['http'].delete).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
