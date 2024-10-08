import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private appConfigService = inject(AppConfigService);

  isManualDeletionEnabled(): boolean {
    const enabled = this.appConfigService.getAppConfig()?.features?.manualDeletion?.enabled;
    if (enabled === undefined || enabled === null) {
      return false;
    }
    return Boolean(enabled);
  }
}
