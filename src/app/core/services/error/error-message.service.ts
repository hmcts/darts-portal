import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorMessage } from '@core-types/error/error-message.interface';
import { HeaderService } from '@services/header/header.service';
import { BehaviorSubject, Observable } from 'rxjs';

//Contains endpoints where errors are handled in their component
const regexIdPlaceholder = '\\d+';
const regexWordPlaceholder = '\\w+';
const subscribedEndpoints = [
  { endpoint: '/api/cases/search', responses: [204, 400, 500] },
  { endpoint: '/api/audio-requests/playback', responses: [403, 404, 500, 502, 504] },
  { endpoint: '/api/transcriptions', responses: [409, 400] },
  { endpoint: '/api/audio-requests', responses: [403, 409] },
  { endpoint: '/api/audio/preview', responses: [403, 404, 500, 502, 504] },
  { endpoint: '/api/retentions', responses: [403, 422] },
  { endpoint: '/api/admin/users', responses: [409] },
  { endpoint: '/api/admin/retention-policy-types', responses: [400, 409] },
  { endpoint: '/api/admin/event-mappings', responses: [409] },
  { endpoint: new RegExp(`/api/admin/${regexWordPlaceholder}/search`), responses: [400] },
  { endpoint: new RegExp(`/api/cases/${regexIdPlaceholder}/transcripts`), responses: [403] },
  { endpoint: new RegExp(`/api/hearings/${regexIdPlaceholder}/transcripts`), responses: [403] },
  { endpoint: new RegExp(`/api/admin/automated-tasks/${regexIdPlaceholder}/run`), responses: [404, 409] },
];

//Contains endpoints where errors will be ignored
const ignoredEndpoints = [
  { endpoint: '/api/audio-requests/not-accessed-count', responses: [400, 401, 403, 404, 500, 502, 504] },
];

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
    if (!this.isSubscribed(error) && !this.isIgnored(error)) {
      switch (error.status) {
        case 403:
          this.showForbidden();
          break;
        case 404:
          this.showNotFound();
          break;
        case 500:
          this.showInternalError();
          break;
        default:
          this.showInternalError();
          break;
      }
    }
  }

  private isSubscribed(response: HttpErrorResponse) {
    return subscribedEndpoints.some((subscribed) => {
      let endpointMatches = false;

      if (typeof subscribed.endpoint === 'string') {
        endpointMatches = response.url?.includes(subscribed.endpoint) ?? false;
      } else if (subscribed.endpoint instanceof RegExp) {
        endpointMatches = subscribed.endpoint.test(response.url || '');
      }

      const responseMatches = subscribed.responses.includes(response.status);
      return endpointMatches && responseMatches;
    });
  }

  private isIgnored(response: HttpErrorResponse) {
    return ignoredEndpoints.some((subscribed) => {
      const endpointMatches = response.url?.includes(subscribed.endpoint);
      const responseMatches = subscribed.responses.includes(response.status);

      return endpointMatches && responseMatches;
    });
  }

  private showGlobalErrorPage(route: string) {
    this.router.navigateByUrl(route);
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }

  private showForbidden() {
    this.showGlobalErrorPage('forbidden');
  }

  private showNotFound() {
    this.showGlobalErrorPage('page-not-found');
  }

  private showInternalError() {
    this.showGlobalErrorPage('internal-error');
  }
}
