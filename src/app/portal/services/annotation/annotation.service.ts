import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnotationService {
  constructor(private readonly http: HttpClient) {}

  downloadAnnotationDocument(annotationId: number, annotationDocumentId: number): Observable<Blob> {
    return this.http.get(`/api/annotations/${annotationId}/documents/${annotationDocumentId}`, {
      responseType: 'blob',
    });
  }
  downloadAnnotationTemplate(): Observable<Blob> {
    return this.http.get(`/download/annotations/template`, {
      responseType: 'blob',
    });
  }

  deleteAnnotation(annotationId: number) {
    return this.http.delete(`/api/annotations/${annotationId}`);
  }
}
