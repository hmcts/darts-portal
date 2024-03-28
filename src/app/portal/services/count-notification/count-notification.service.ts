import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranscriberRequestCounts } from '@portal-types/transcriptions/transcription-request-counts.interface';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { merge } from 'rxjs/internal/observable/merge';
import { timer } from 'rxjs/internal/observable/timer';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';

export const UNREAD_AUDIO_COUNT_PATH = 'api/audio-requests/not-accessed-count';
export const TRANSCRIPTION_COUNT_PATH = 'api/transcriptions/transcriber-counts';

@Injectable({
  providedIn: 'root',
})
export class CountNotificationService {
  http = inject(HttpClient);

  private readonly POLL_INTERVAL_SECS = 30;

  private readonly assignedTranscriptCount = new BehaviorSubject<number>(0);
  private readonly unassignedTranscriptCount = new BehaviorSubject<number>(0);
  private readonly unreadAudioCount = new BehaviorSubject<number>(0);

  private readonly assignedTranscriptCount$ = this.assignedTranscriptCount.asObservable();
  private readonly unassignedTranscriptCount$ = this.unassignedTranscriptCount.asObservable();
  private readonly unreadAudioCount$ = this.unreadAudioCount.asObservable();

  private readonly timer$ = timer(0, this.POLL_INTERVAL_SECS * 1000);

  private readonly pollAssignedTranscriptCount$ = this.timer$.pipe(
    switchMap(() => this.getAssignedTranscriptCount()),
    tap((count) => this.setAssignedTranscriptCount(count))
  );
  private readonly pollUnassignedTranscriptCount$ = this.timer$.pipe(
    switchMap(() => this.getUnassignedTranscriptCount()),
    tap((count) => this.setUnassignedTranscriptCount(count))
  );
  private readonly pollUnreadAudioCount$ = this.timer$.pipe(switchMap(() => this.getUnreadAudioCount()));

  assignedTranscripts$ = merge(this.pollAssignedTranscriptCount$, this.assignedTranscriptCount$);

  unassignedTranscripts$ = merge(this.pollUnassignedTranscriptCount$, this.unassignedTranscriptCount$);

  unreadAudio$ = merge(this.pollUnreadAudioCount$, this.unreadAudioCount$);

  decrementUnreadAudioCount() {
    this.unreadAudioCount.next(this.unreadAudioCount.value - 1);
  }

  decrementUnassignedTranscriptCount() {
    this.unassignedTranscriptCount.next(this.unassignedTranscriptCount.value - 1);
  }

  decrementAssignedTranscriptCount() {
    this.assignedTranscriptCount.next(this.assignedTranscriptCount.value - 1);
  }

  incrementAssignedTranscriptCount() {
    this.assignedTranscriptCount.next(this.assignedTranscriptCount.value + 1);
  }

  setUnreadAudioCount(count: number) {
    this.unreadAudioCount.next(count);
  }

  setAssignedTranscriptCount(count: number): void {
    this.assignedTranscriptCount.next(count);
  }

  setUnassignedTranscriptCount(count: number): void {
    this.unassignedTranscriptCount.next(count);
  }

  getTranscriptCounts$ = this.http.get<TranscriberRequestCounts>(TRANSCRIPTION_COUNT_PATH);

  getAssignedTranscriptCount(): Observable<number> {
    return this.getTranscriptCounts$.pipe(map((res) => res.assigned));
  }

  getUnassignedTranscriptCount(): Observable<number> {
    return this.getTranscriptCounts$.pipe(map((res) => res.unassigned));
  }

  getUnreadAudioCount(): Observable<number> {
    return this.http.get<{ count: number }>(UNREAD_AUDIO_COUNT_PATH).pipe(map((res) => res.count));
  }
}
