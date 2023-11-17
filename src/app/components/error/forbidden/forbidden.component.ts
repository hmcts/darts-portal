import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent {
  private appConfigService = inject(AppConfigService);
  support = this.appConfigService.getAppConfig()?.support;

  @Input() header!: string;
}
