import { sortNamesAlphabetically } from './transform.utils';

describe('sortNamesAlphabetically', () => {
  it('should return an empty array when the supplied list is empty', () => {
    const result = sortNamesAlphabetically([]);

    expect(result).toEqual([]);
  });

  it('should return an empty array when names is undefined', () => {
    const result = sortNamesAlphabetically(undefined);

    expect(result).toEqual([]);
  });

  it('should return names alphabetically when the input is unordered', () => {
    const names = ['Zoe Taylor', 'Alex Brown', 'Morgan Reed'];

    const result = sortNamesAlphabetically(names);

    expect(result).toEqual(['Alex Brown', 'Morgan Reed', 'Zoe Taylor']);
  });

  it('should preserve the input array when sorting names', () => {
    const names = Object.freeze(['Zoe Taylor', 'Alex Brown', 'Morgan Reed']);

    sortNamesAlphabetically(names);

    expect(names).toEqual(['Zoe Taylor', 'Alex Brown', 'Morgan Reed']);
  });

  it('should ignore caseing when ordering names alphabetically', () => {
    const names = ['zoe Taylor', 'ALEX Brown', 'morgan Reed'];

    const result = sortNamesAlphabetically(names);

    expect(result).toEqual(['ALEX Brown', 'morgan Reed', 'zoe Taylor']);
  });

  it('should ignore accents when ordering names alphabetically', () => {
    const names = ['\u00c9mile Laurent', 'Emile Laurent', 'Alex Brown'];

    const result = sortNamesAlphabetically(names);

    expect(result).toEqual(['Alex Brown', '\u00c9mile Laurent', 'Emile Laurent']);
  });
});
