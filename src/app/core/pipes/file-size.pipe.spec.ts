import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe (binary)', () => {
  let pipe: FileSizePipe;

  beforeEach(() => {
    pipe = new FileSizePipe();
  });

  it('should format bytes to KB if less than 1MB', () => {
    const bytes = 500 * 1024; // 512,000 bytes
    const result = pipe.transform(bytes);
    expect(result).toBe('500.00KB');
  });

  it('should format bytes to MB if 1MB or more', () => {
    const bytes = 5 * 1024 * 1024; // 5,242,880 bytes
    const result = pipe.transform(bytes);
    expect(result).toBe('5.00MB');
  });

  it('should round to two decimal places', () => {
    const bytes = 1536; // 1.5 KB
    const result = pipe.transform(bytes);
    expect(result).toBe('1.50KB');
  });

  it('should handle exactly 1MB correctly', () => {
    const bytes = 1024 * 1024;
    const result = pipe.transform(bytes);
    expect(result).toBe('1.00MB');
  });

  it('should handle zero bytes', () => {
    const result = pipe.transform(0);
    expect(result).toBe('0.00KB');
  });
});
