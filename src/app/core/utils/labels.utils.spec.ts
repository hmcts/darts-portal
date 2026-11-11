import { LABELS } from '@constants/labels.constant';
import { getJudgeLabel } from './labels.utils';

describe('getJudgeLabel', () => {
  const featureFlags = { isEnabled: jest.fn() };

  beforeEach(() => featureFlags.isEnabled.mockReset());

  it.each(['Judge', 'Judge(s)'] as const)(
    'should return the provided fallback text when the updated-judge-label flag is disabled - %s',
    (fallback) => {
      featureFlags.isEnabled.mockReturnValue(false);
      expect(getJudgeLabel(featureFlags, fallback)).toBe(fallback);
    }
  );

  it.each(['Judge', 'Judge(s)'] as const)(
    'should return Judge(s)/Magistrates label when the updated-judge-label flag is enabled - %s',
    (fallback) => {
      featureFlags.isEnabled.mockReturnValue(true);
      expect(getJudgeLabel(featureFlags, fallback)).toBe(LABELS.judgesAndMagistrates);
    }
  );

  it('should get the state of the updated-judge-label feature flag', () => {
    getJudgeLabel(featureFlags, 'Judge(s)');
    expect(featureFlags.isEnabled).toHaveBeenCalledWith('updated-judge-label');
  });
});
