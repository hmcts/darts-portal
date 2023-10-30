import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ErrorMessageService } from '@services/error/error-message.service';

@Component({
  selector: 'app-internal-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './internal-error.component.html',
  styleUrls: ['./internal-error.component.scss'],
})
export class InternalErrorComponent {
  errorMsgService = inject(ErrorMessageService);
  error$ = this.errorMsgService.errorMessage$;
}
