import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorMessage } from '@darts-types/error-message.interface';
import { HeaderService } from '@services/header/header.service';
import { BehaviorSubject, Observable } from 'rxjs';

//Contains endpoints where errors are handled in their component
const subscribedEndpoints = ['/api/cases/search'];

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  private errorMessage: BehaviorSubject<ErrorMessage | null> = new BehaviorSubject<ErrorMessage | null>(null);
  readonly errorMessage$: Observable<ErrorMessage | null> = this.errorMessage.asObservable();

  constructor(
    private headerService: HeaderService,
    private router: Router
  ) {}

  handleErrorMessage(error: HttpErrorResponse) {
    error.error && this.setErrorMessage({ status: error.status, detail: error.error });
    this.handleOtherPages(error);
  }

  setErrorMessage(error: ErrorMessage) {
    this.errorMessage.next(error);
  }

  clearErrorMessage() {
    this.errorMessage.next(null);
  }

  updateDisplayType(type: 'PAGE' | 'COMPONENT'): void {
    const currentError: ErrorMessage | null = this.errorMessage.getValue();
    if (currentError) {
      currentError.display = type;
      this.errorMessage.next(currentError);
    }
  }

  //Used to handle other components/endpoints that do not subscribe to the error
  private handleOtherPages(error: HttpErrorResponse) {
    const isIncluded = subscribedEndpoints.some((endpoint) => error.url?.includes(endpoint));
    if (error.status === 500 && !isIncluded) {
      this.showInternalError();
    }
  }

  private showInternalError() {
    this.router.navigateByUrl('internal-error');
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }
}
