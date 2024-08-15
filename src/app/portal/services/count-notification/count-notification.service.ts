import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { merge } from 'rxjs/internal/observable/merge';
import { timer } from 'rxjs/internal/observable/timer';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';
import { TranscriptRequestCounts } from '../../models';

export const UNREAD_AUDIO_COUNT_PATH = 'api/audio-requests/not-accessed-count';
export const TRANSCRIPTION_COUNT_PATH = 'api/transcriptions/transcriber-counts';

@Injectable({
  providedIn: 'root',
})
export class CountNotificationService {
  http = inject(HttpClient);

  private readonly POLL_INTERVAL_SECS = 30;

  private readonly transcriptRequestCountsSubject = new BehaviorSubject<TranscriptRequestCounts>({
    assigned: 0,
    unassigned: 0,
  });

  private readonly unreadAudioCount = new BehaviorSubject<number>(0);

  private readonly transcriptRequestCounts$ = this.transcriptRequestCountsSubject.asObservable();
  private readonly unreadAudioCount$ = this.unreadAudioCount.asObservable();

  private readonly timer$ = timer(0, this.POLL_INTERVAL_SECS * 1000);

  private readonly pollTranscriptCount$ = this.timer$.pipe(
    switchMap(() => this.getTranscriptCount()),
    tap((counts) => this.setTranscriptCounts(counts))
  );

  private readonly pollUnreadAudioCount$ = this.timer$.pipe(switchMap(() => this.getUnreadAudioCount()));

  getTranscriptCount() {
    return this.http.get<TranscriptRequestCounts>(TRANSCRIPTION_COUNT_PATH);
  }

  transcriptCount$ = merge(this.pollTranscriptCount$, this.transcriptRequestCounts$);

  unreadAudio$ = merge(this.pollUnreadAudioCount$, this.unreadAudioCount$);

  decrementUnreadAudioCount() {
    this.unreadAudioCount.next(this.unreadAudioCount.value - 1);
  }

  decrementUnassignedTranscriptCount() {
    const { assigned, unassigned } = this.transcriptRequestCountsSubject.value;
    this.transcriptRequestCountsSubject.next({ assigned, unassigned: unassigned - 1 });
  }

  decrementAssignedTranscriptCount() {
    const { assigned, unassigned } = this.transcriptRequestCountsSubject.value;
    this.transcriptRequestCountsSubject.next({ unassigned, assigned: assigned - 1 });
  }

  incrementAssignedTranscriptCount() {
    const { assigned, unassigned } = this.transcriptRequestCountsSubject.value;
    this.transcriptRequestCountsSubject.next({ unassigned, assigned: assigned + 1 });
  }

  setUnreadAudioCount(count: number) {
    this.unreadAudioCount.next(count);
  }

  setAssignedTranscriptCount(assigned: number) {
    const { unassigned } = this.transcriptRequestCountsSubject.value;
    this.transcriptRequestCountsSubject.next({ unassigned, assigned });
  }

  setUnassignedTranscriptCount(unassigned: number) {
    const { assigned } = this.transcriptRequestCountsSubject.value;
    this.transcriptRequestCountsSubject.next({ assigned, unassigned });
  }

  setTranscriptCounts(counts: TranscriptRequestCounts) {
    this.transcriptRequestCountsSubject.next(counts);
  }

  getUnreadAudioCount(): Observable<number> {
    return this.http.get<{ count: number }>(UNREAD_AUDIO_COUNT_PATH).pipe(map((res) => res.count));
  }
}
