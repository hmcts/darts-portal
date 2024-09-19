import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  /* 
    Store the history of back URLs
    Each entry is a tuple of [currentUrl, backUrl]
  */
  private backUrlHistory = signal<[string, string][]>([]);

  addBackUrl(url: string, backUrl: string) {
    this.backUrlHistory.update((current) => [...current, [url, backUrl]]);
  }

  getBackUrl(url: string) {
    const lastBackUrl = this.backUrlHistory()
      .toReversed()
      .find(([currentUrl]) => url.includes(currentUrl));
    return lastBackUrl ? lastBackUrl[1] : null;
  }

  clearHistory() {
    this.backUrlHistory.set([]);
  }
}
