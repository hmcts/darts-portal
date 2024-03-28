import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  it('create an instance', () => {
    const pipe = new DurationPipe();
    expect(pipe).toBeTruthy();
  });

  it('should format 99Y12M31D to 99y 12m 31d', () => {
    const pipe = new DurationPipe();
    const mockString = '99Y12M31D';
    const expected = '99y 12m 31d';
    const result = pipe.transform(mockString);
    expect(result).toEqual(expected);
  });

  it('should format null or empty to "-"', () => {
    const pipe = new DurationPipe();
    const mockString = '';
    const expected = '-';
    const result = pipe.transform(mockString);
    expect(result).toEqual(expected);
  });
});
