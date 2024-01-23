import { ArrayDisplayPipe } from './array-display.pipe';

describe('ArrayDisplayPipe', () => {
  let pipe: ArrayDisplayPipe;

  beforeEach(() => {
    pipe = new ArrayDisplayPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string when the array is null', () => {
    const arr: string[] = [];
    const result = pipe.transform(arr);
    expect(result).toEqual('');
  });

  it('should return an empty string when the array is empty', () => {
    const arr: string[] = [];
    const result = pipe.transform(arr);
    expect(result).toEqual('');
  });

  it('should return the first element when the array has only one element', () => {
    const arr = ['Single'];
    const result = pipe.transform(arr);
    expect(result).toEqual('Single');
  });

  it('should return "Multiple" when the array has more than one element', () => {
    const arr = ['Element 1', 'Element 2'];
    const result = pipe.transform(arr);
    expect(result).toEqual('Multiple');
  });
});
