import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AudioSample {
  name: string;
  sampleSource: string;
  downloadSource: string;
}

@Injectable({
  providedIn: 'root',
})
export class AudioSamplesService {
  constructor(private http: HttpClient) {}

  getSampleList(): Observable<AudioSample[]> {
    return this.http.get<AudioSample[]>('media/samples', { observe: 'body' });
  }
}
