import { LABELS } from '@constants/labels.constant';
import { getJudgesAndMagistratesLabel, getJudgesAndMagistratesNames } from './judges-and-magistrates.utils';
import { sortNamesAlphabetically } from './transform.utils';

jest.mock('./transform.utils', () => ({
  sortNamesAlphabetically: jest.fn(),
}));

describe('getJudgesAndMagistratesLabel', () => {
  const featureFlags = { isEnabled: jest.fn() };

  beforeEach(() => featureFlags.isEnabled.mockReset());

  it('should get the state of the updated-judge-label feature flag', () => {
    getJudgesAndMagistratesLabel(featureFlags, 'Judge(s)');
    expect(featureFlags.isEnabled).toHaveBeenCalledWith('updated-judge-label');
  });

  it.each(['Judge', 'Judge(s)'] as const)(
    'should return the provided fallback text when the updated-judge-label flag is disabled - %s',
    (fallback) => {
      featureFlags.isEnabled.mockReturnValue(false);
      expect(getJudgesAndMagistratesLabel(featureFlags, fallback)).toBe(fallback);
    }
  );

  it.each(['Judge', 'Judge(s)'] as const)(
    'should return Judge(s)/Magistrates label when the updated-judge-label flag is enabled - %s',
    (fallback) => {
      featureFlags.isEnabled.mockReturnValue(true);
      expect(getJudgesAndMagistratesLabel(featureFlags, fallback)).toBe(LABELS.judgesAndMagistrates);
    }
  );
});

describe('getJudgesAndMagistratesNames', () => {
  const featureFlags = { isEnabled: jest.fn() };
  const sortNamesAlphabeticallyMock = jest.mocked(sortNamesAlphabetically);
  const nameLists = [
    { description: 'a populated list', names: ['Zoe Taylor', 'Alex Brown'] },
    { description: 'an empty list', names: [] },
    { description: 'undefined', names: undefined },
  ];

  beforeEach(() => {
    featureFlags.isEnabled.mockReset();
    sortNamesAlphabeticallyMock.mockReset();
  });

  it('should get the state of the updated-judge-label feature flag', () => {
    getJudgesAndMagistratesNames(featureFlags, []);

    expect(featureFlags.isEnabled).toHaveBeenCalledWith('updated-judge-label');
  });

  it.each(nameLists)(
    'should return the original list when the updated-judge-label flag is disabled - $description',
    ({ names }) => {
      const expectedNames = names?.slice();
      featureFlags.isEnabled.mockReturnValue(false);

      const result = getJudgesAndMagistratesNames(featureFlags, names);

      expect(result).toEqual(expectedNames);
    }
  );

  it.each(nameLists)(
    'should not call the sorter when the updated-judge-label flag is disabled - $description',
    ({ names }) => {
      featureFlags.isEnabled.mockReturnValue(false);

      getJudgesAndMagistratesNames(featureFlags, names);

      expect(sortNamesAlphabeticallyMock).not.toHaveBeenCalled();
    }
  );

  it.each(nameLists)(
    'should pass the original list to the sorter when the updated-judge-label flag is enabled - $description',
    ({ names }) => {
      featureFlags.isEnabled.mockReturnValue(true);

      getJudgesAndMagistratesNames(featureFlags, names);

      expect(sortNamesAlphabeticallyMock).toHaveBeenCalledWith(names);
    }
  );

  it.each(nameLists)(
    'should return the sorter result when the updated-judge-label flag is enabled - $description',
    ({ names }) => {
      const sorterResult = ['ordered', 'list'];
      Object.freeze(sorterResult);
      featureFlags.isEnabled.mockReturnValue(true);
      sortNamesAlphabeticallyMock.mockReturnValue(sorterResult);

      const result = getJudgesAndMagistratesNames(featureFlags, names);

      expect(result).toEqual(sorterResult);
    }
  );
});
