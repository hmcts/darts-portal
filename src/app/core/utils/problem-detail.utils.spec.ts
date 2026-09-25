import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { normalizeProblemDetailsError } from './problem-detail.utils';

function createBlob(body: string, type: string, textResult: Promise<string> = Promise.resolve(body)): Blob {
  const blob = new Blob([body], { type });
  Object.defineProperty(blob, 'text', { value: jest.fn().mockReturnValue(textResult) });
  return blob;
}

describe('normalizeProblemDetailsError', () => {
  it('should return non HTTP errors unchanged', async () => {
    const error = new Error('Nope');

    await expect(firstValueFrom(normalizeProblemDetailsError(error))).resolves.toBe(error);
  });

  it('should return HTTP errors unchanged when the error body is not a Blob', async () => {
    const error = new HttpErrorResponse({ error: { type: 'CASE_100' }, status: 422 });

    await expect(firstValueFrom(normalizeProblemDetailsError(error))).resolves.toBe(error);
  });

  it('should return Blob errors unchanged when the content type is not problem details', async () => {
    const error = new HttpErrorResponse({ error: createBlob('{}', 'application/json'), status: 422 });

    await expect(firstValueFrom(normalizeProblemDetailsError(error))).resolves.toBe(error);
  });

  it('should parse problem details Blob errors and preserve response metadata', async () => {
    const problemDetails = {
      type: 'RETENTION_107',
      title: 'The retention date being applied is too late.',
      status: 422,
      max_duration: '100Y0M0D',
    };
    const headers = new HttpHeaders({ 'x-test': 'yes' });
    const error = new HttpErrorResponse({
      error: createBlob(JSON.stringify(problemDetails), 'application/problem+json'),
      headers,
      status: 422,
      statusText: 'Unprocessable Entity',
      url: '/api/retentions',
    });

    const result = await firstValueFrom(normalizeProblemDetailsError(error));

    expect(result).toBeInstanceOf(HttpErrorResponse);
    expect((result as HttpErrorResponse).error).toEqual(problemDetails);
    expect((result as HttpErrorResponse).headers).toBe(headers);
    expect((result as HttpErrorResponse).status).toBe(422);
    expect((result as HttpErrorResponse).statusText).toBe('Unprocessable Entity');
    expect((result as HttpErrorResponse).url).toBe('/api/retentions');
  });

  it('should parse legacy json problem Blob errors', async () => {
    const problemDetails = { type: 'CASE_100', status: 422, title: 'Too many results' };
    const error = new HttpErrorResponse({
      error: createBlob(JSON.stringify(problemDetails), 'application/json+problem'),
      status: 422,
    });

    const result = await firstValueFrom(normalizeProblemDetailsError(error));

    expect((result as HttpErrorResponse).error).toEqual(problemDetails);
  });

  it('should return the original error when the problem details body is not an object', async () => {
    const error = new HttpErrorResponse({
      error: createBlob('[]', 'application/problem+json'),
      status: 422,
    });

    await expect(firstValueFrom(normalizeProblemDetailsError(error))).resolves.toBe(error);
  });

  it('should return the original error when the problem details body cannot be read', async () => {
    const error = new HttpErrorResponse({
      error: createBlob('{}', 'application/problem+json', Promise.reject(new Error('Blob read failed'))),
      status: 422,
    });

    await expect(firstValueFrom(normalizeProblemDetailsError(error))).resolves.toBe(error);
  });
});
