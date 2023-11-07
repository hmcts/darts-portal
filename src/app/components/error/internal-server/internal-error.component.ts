import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';
import { ErrorMessageService } from '@services/error/error-message.service';

@Component({
  selector: 'app-internal-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './internal-error.component.html',
  styleUrls: ['./internal-error.component.scss'],
})
export class InternalErrorComponent {
  private errorMsgService = inject(ErrorMessageService);
  private appConfigService = inject(AppConfigService);
  error$ = this.errorMsgService.errorMessage$;
  support = this.appConfigService.getAppConfig()?.support;
}
