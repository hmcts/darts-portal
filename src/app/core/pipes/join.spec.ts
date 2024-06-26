import { JoinPipe } from './join';

describe('JoinPipe', () => {
  const pipe = new JoinPipe();

  it('joins a string array with default separator', () => {
    expect(pipe.transform(['a', 'b', 'c'])).toBe('a, b, c');
  });

  it('joins a string array with custom separator', () => {
    expect(pipe.transform(['a', 'b', 'c'], ' | ')).toBe('a | b | c');
  });

  it('joins a number array with default separator', () => {
    expect(pipe.transform([1, 2, 3])).toBe('1, 2, 3');
  });

  it('joins a number array with custom separator', () => {
    expect(pipe.transform([1, 2, 3], ' | ')).toBe('1 | 2 | 3');
  });

  it('handles undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('handles custom undefined', () => {
    expect(pipe.transform(undefined, ', ', 'BANANA')).toBe('BANANA');
  });

  it('handles empty array as undefined', () => {
    expect(pipe.transform([], ', ', 'MANGO')).toBe('MANGO');
  });
});
