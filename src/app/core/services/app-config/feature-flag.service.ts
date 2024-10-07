import { Inject, Injectable } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';

@Injectable()
export class FeatureFlagService {
  constructor(@Inject(AppConfigService) private appConfigService: AppConfigService) {}

  isManualDeletionEnabled(): boolean {
    const enabled = this.appConfigService.getAppConfig()?.features?.manualDeletion?.enabled;
    if (enabled === undefined || enabled === null) {
      return false;
    }
    return Boolean(enabled);
  }
}
