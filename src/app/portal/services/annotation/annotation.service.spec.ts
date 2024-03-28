import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnnotationService } from '@services/annotation/annotation.service';
import { of } from 'rxjs';

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

  describe('#downloadAnnotationTemplate', () => {
    it('should get annotation template', () => {
      const mockBlob = new Blob(['mock document data'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      jest.spyOn(service['http'], 'get').mockReturnValueOnce(of(mockBlob));

      let receivedBlob: Blob | undefined;
      service.downloadAnnotationTemplate().subscribe((blob: Blob) => {
        receivedBlob = blob;
      });

      const expectedUrl = `/download/annotations/template`;
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

  describe('#uploadAnnotationDocument', () => {
    it('should call the correct endpoint with the correct data', (done) => {
      const hearingId = 1;
      const comment = 'Extra notes';
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const mockDTO = {
        hearing_id: hearingId,
        comment: comment,
      };

      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('annotation', new Blob([JSON.stringify(mockDTO)], { type: 'application/json' }));

      const spyPost = jest.spyOn(service['http'], 'post');

      service.uploadAnnotationDocument(file, hearingId, comment).subscribe(() => {
        expect(spyPost).toHaveBeenCalledWith(`/api/annotations`, formData);
        done();
      });

      const req = httpTestingController.expectOne(`/api/annotations`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);

      req.flush({});
    });
  });
});
