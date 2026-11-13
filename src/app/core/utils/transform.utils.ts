// Convert 'true' or 'false' string to boolean
export const optionalStringToBooleanOrNull = (string?: string): boolean | null => {
  if (string === undefined) return null;
  else return string === 'true';
};

/** Returns names in English alphabetical order without modifying the array provided. */
export function sortNamesAlphabetically(names: readonly string[] | undefined): string[] {
  return (names ?? []).toSorted((first, second) => first.localeCompare(second, 'en-GB', { sensitivity: 'base' }));
}
