import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActiveTabService {
  /*
  Service to to track active tabs for different screens
  The key is the screenId and the value is the tabName
    { 'screenId': 'tabName' }
  */

  private readonly state = signal<Record<string, string>>({});

  activeTabs = this.state.asReadonly();

  setActiveTab(screenId: string, tabName: string) {
    this.state.update((tabs) => ({
      ...tabs,
      [screenId]: tabName,
    }));
  }
}
