import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnotationsService {
  constructor(private readonly http: HttpClient) {}

  downloadAnnotationDocument(annotationId: number, AnnotationDocumentId: number): Observable<Blob> {
    return this.http.get(`/api/annotations/${annotationId}/documents/${AnnotationDocumentId}`, {
      responseType: 'blob',
    });
  }
}
