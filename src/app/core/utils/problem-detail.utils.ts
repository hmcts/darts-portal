import { HttpErrorResponse } from '@angular/common/http';
import { ErrorType } from '@core-types/error/error-type.type';
import { Observable, catchError, from, map, of } from 'rxjs';

const PROBLEM_DETAIL_CONTENT_TYPES = ['application/problem+json', 'application/json+problem'];

export function normalizeProblemDetailsError(error: unknown): Observable<unknown> {
  if (!(error instanceof HttpErrorResponse) || !(error.error instanceof Blob) || !isProblemDetailsBlob(error.error)) {
    return of(error);
  }

  return from(readBlobAsText(error.error)).pipe(
    map((text) => parseProblemDetails(text)),
    map((problemDetails) => (problemDetails ? withParsedError(error, problemDetails) : error)),
    catchError(() => of(error))
  );
}

function isProblemDetailsBlob(blob: Blob): boolean {
  return PROBLEM_DETAIL_CONTENT_TYPES.some((contentType) => blob.type.includes(contentType));
}

function readBlobAsText(blob: Blob): Promise<string> {
  if (typeof blob.text === 'function') {
    return blob.text();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

function parseProblemDetails(text: string): ErrorType | null {
  const parsed: unknown = JSON.parse(text);
  return isRecord(parsed) ? (parsed as ErrorType) : null;
}

function withParsedError(error: HttpErrorResponse, problemDetails: ErrorType): HttpErrorResponse {
  return new HttpErrorResponse({
    error: problemDetails,
    headers: error.headers,
    status: error.status,
    statusText: error.statusText,
    url: error.url ?? undefined,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
