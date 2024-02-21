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

  uploadAnnotationDocument(file: File, hearingId: number, comment?: string) {
    const postDTO = {
      hearing_id: hearingId,
      comment: comment,
    };
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('annotation', new Blob([JSON.stringify(postDTO)], { type: 'application/json' }));
    return this.http.post(`/api/annotations`, formData);
  }

  deleteAnnotation(annotationId: number) {
    return this.http.delete(`/api/annotations/${annotationId}`);
  }
}
