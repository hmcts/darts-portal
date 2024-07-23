import { HumanizeInitCapPipe } from './humanizeInitCap';

describe('HumanizeInitCapPipe', () => {
  const pipe = new HumanizeInitCapPipe();

  it('simple case', () => {
    expect(pipe.transform('TestTestTest')).toBe('Test Test Test');
  });

  it('acronyms 1', () => {
    expect(pipe.transform('TESTTestTest')).toBe('TEST Test Test');
  });

  it('acronyms 2', () => {
    expect(pipe.transform('TestTESTTest')).toBe('Test TEST Test');
  });

  it('acronyms 3', () => {
    expect(pipe.transform('TestTestTEST')).toBe('Test Test TEST');
  });

  it('single capitals', () => {
    expect(pipe.transform('ThisIsATest')).toBe('This Is A Test');
  });

  it('all together now', () => {
    expect(pipe.transform('FYIThisIsATestBTW')).toBe('FYI This Is A Test BTW');
  });
});
