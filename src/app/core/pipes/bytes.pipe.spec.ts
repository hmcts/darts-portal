import { BytesPipe } from './bytes.pipe';

describe('BytesPipe', () => {
  let pipe: BytesPipe;

  beforeEach(() => {
    pipe = new BytesPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 if bytes is 0', () => {
    expect(pipe.transform(0, 'KB')).toBe(0);
    expect(pipe.transform(0, 'MB')).toBe(0);
    expect(pipe.transform(0, 'GB')).toBe(0);
  });

  it('should return kilobytes (divided by 1024) if unit is KB', () => {
    expect(pipe.transform(1024, 'KB')).toBe(1);
  });

  it('should return megabytes (divided by 1024 * 1024) if unit is MB', () => {
    expect(pipe.transform(1048576, 'MB')).toBe(1);
  });

  it('should return gigabytes (divided by 1024 * 1024 * 1024) if unit is GB', () => {
    expect(pipe.transform(1073741824, 'GB')).toBe(1);
  });

  it('default unit should be MB', () => {
    expect(pipe.transform(1048576)).toBe(1);
  });
});
