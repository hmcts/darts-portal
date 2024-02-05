import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { ErrorMessageService } from 'src/app/core/services/error/error-message.service';

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
