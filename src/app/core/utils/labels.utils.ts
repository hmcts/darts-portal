import { LABELS } from '@constants/labels.constant';
import type { FeatureFlagService } from '@services/app-config/feature-flag.service';

/**
 * Returns the text to use for the judge label based on the updated-judge-label feature flag, 
 * so all pages using the updated wording can use the same flag-controlled version. This is a
 * temporary function and once the feature flag is removed, all calls to it should be replaced
 * with LABELS.judgesAndMagistrates and this helper should be removed along with its tests.
 *
 * @param fallback The page's existing label, to be used while the feature flag is disabled.
 */
export function getJudgeLabel(
  featureFlags: Pick<FeatureFlagService, 'isEnabled'>,
  fallback: 'Judge' | 'Judge(s)'
): string {
  return featureFlags.isEnabled('updated-judge-label') ? LABELS.judgesAndMagistrates : fallback;
}
