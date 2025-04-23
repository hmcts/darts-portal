import { DateTime } from 'luxon';

export function isDateSpanMoreThanOneYear(from?: string, to?: string): boolean {
  if (!from || !to) return false;

  const fromDate = DateTime.fromFormat(from, 'dd/MM/yyyy');
  const toDate = DateTime.fromFormat(to, 'dd/MM/yyyy');

  if (!fromDate.isValid || !toDate.isValid) return false;

  return toDate.diff(fromDate, 'days').days > 365;
}
