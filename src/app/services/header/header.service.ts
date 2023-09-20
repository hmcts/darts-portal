import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private isVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  readonly isVisible$: Observable<boolean> = this.isVisible.asObservable();

  showPrimaryNavigation(toggle: boolean) {
    this.isVisible.next(toggle);
  }
}
