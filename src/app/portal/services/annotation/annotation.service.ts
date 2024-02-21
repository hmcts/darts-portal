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

  uploadAnnotationDocument(file: File, comments?: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (comments) {
      formData.append('annotation', comments);
    }
    return this.http.post(`/api/annotations`, formData);
  }
}
