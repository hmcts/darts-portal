import { formatDate } from './date.utils';

describe('#formatDate', () => {
  it('should return YYYY-MM-DD when sent a string of DD/MM/YYYY', () => {
    const dateString = '21/07/2001';
    const result = formatDate(dateString);
    const expectedResult = '2001-07-21';
    expect(result).toEqual(expectedResult);
  });
});
