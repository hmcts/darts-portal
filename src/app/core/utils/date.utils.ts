import { DateTime } from 'luxon';

// takes a date of format DD/MM/YYYY and returns YYYY-MM-DD
export function formatDate(date: string | null | undefined): string | null {
  return date ? date.split('/').reverse().join('-') : null;
}

export const TOMORROW = DateTime.now().plus({ days: 1 }).startOf('day').toFormat('dd/MM/yyyy');
export const YESTERDAY = DateTime.now().minus({ days: 1 }).startOf('day').toFormat('dd/MM/yyyy');
export const TODAY = DateTime.now().startOf('day').toFormat('dd/MM/yyyy');
